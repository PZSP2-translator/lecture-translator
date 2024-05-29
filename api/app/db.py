import oracledb

un = "PZSP06"
cs = "ora2.ia.pw.edu.pl/iais"


def load_password_from_file(path):
    return open(path, "r").read()


pw = load_password_from_file("app/password")


def load_sql_file(filename):
    with open(filename, "r") as file:
        return file.read()


# def setup_database():
#     # relative path
#     create = load_sql_file('/database/create_db.sql')
#     proc_func = load_sql_file('/database/procedures_functions.sql')

#     with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
#         with connection.cursor() as cursor:
#             # cursor.executescript(create)
#             # cursor.executescript(proc_func)
#         connection.commit()

def get_lectures(user_id):
    rows = []
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            for row in cursor.execute("""
select p.lecture_id, l.title, l.lecture_date, p.user_type
from participants p join lectures l on (l.lecture_id = p.lecture_id)
where user_id=:1""", [user_id]):
                rows.append(row)
    return rows


def create_lecture(title, lecturer_id=None):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            lecturer_code = cursor.var(str)
            lecture_id = cursor.var(int)
            cursor.callproc("create_lecture", [title, lecturer_code, lecture_id])
            lecture_id = lecture_id.getvalue()
            if lecturer_id:
                already_joined = cursor.var(int)
                cursor.callproc("join_lecture", [lecture_id, lecturer_id, "L", already_joined])
            return lecturer_code.getvalue(), lecture_id


def login(mail, pass_hash):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            user_id = cursor.callfunc("login", int, [mail, pass_hash])
            return user_id


def create_user(first_name, last_name, mail, pass_hash):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            is_succesful = cursor.var(int)
            cursor.callproc(
                "create_user", [first_name, last_name, mail, pass_hash,
                                is_succesful]
            )
            return is_succesful.getvalue()


def join_lecture(lecture_code, user_id=None, user_type="S"):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            query = """select lecture_id from lectures where student_code=:1"""
            cursor.execute(query, [lecture_code])
            result = cursor.fetchone()
            if result is None:
                return result, -1
            elif user_id is None:
                return result, 0
            already_joined = cursor.var(int)
            cursor.callproc(
                "join_lecture", [lecture_code, user_id, user_type,
                                 already_joined]
            )
            return result, already_joined.getvalue()


def add_transcription(lecture_id, text):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            cursor.callproc("add_transcription", [lecture_id, text])


def get_transcription(lecture_id, last=False):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            if not last:
                text = cursor.var(str)
                cursor.callfunc("get_transcription", str, [lecture_id, text])
                return text.getvalue()
            else:
                cursor.execute("""
                    SELECT text FROM transcriptions
                    WHERE lecture_id = :1
                    ORDER BY time DESC
                    FETCH FIRST 1 ROWS ONLY
                """, [lecture_id])
                result = cursor.fetchone()
                if result:
                    return result[0].read()
                return None


def add_presenation(lecture_id, link):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            cursor.callproc("add_presentation", [lecture_id, link])


def change_password(user_id, pass_hash):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            cursor.callproc("change_password", [user_id, pass_hash])


def get_lecture_id(lecture_code):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            for row in cursor.execute("""
select lecture_id
from lectures
where student_code=:1""", [lecture_code]):
                return row


def get_note(user_id, lecture_id):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            for row in cursor.execute("""
select note
from participants
where user_id=:1 and lecture_id:=2""", [user_id, lecture_id]):

                return row


def get_lecture_metadata(lecture_id):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
select lecture_id, title, lecture_date, student_code, presentation_link
from lectures
where lecture_id=:1""", [lecture_id])
            return cursor.fetchone()
