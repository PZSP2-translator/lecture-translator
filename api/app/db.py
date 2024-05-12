import getpass
import oracledb
import os

un = 'PZSP06'
cs = 'ora2.ia.pw.edu.pl/iais'
# pw = getpass.getpass(f'Enter password for {un}@{cs}: ')     # zaszyfrować i przesłać hasło do bazy

def load_password_from_file(path):
    return open(path, "r").read()

pw = load_password_from_file("app/password")


def load_sql_file(filename):
    with open(filename, 'r') as file:
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


def get_lectures():
    rows = []
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            for row in cursor.execute("select * from lectures"):
                rows.append(row)
    return rows


def create_lecture(title):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            lecture_id = cursor.var(int)
            cursor.callproc("create_lecture", [title, lecture_id])
            return lecture_id.getvalue()


def login(mail, pass_hash):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            user_id = cursor.callfunc("login", int, [mail, pass_hash])
            return user_id


def create_user(first_name, last_name, mail, pass_hash):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            is_succesful = cursor.var(int)
            cursor.callproc("create_user", [first_name, last_name, mail, pass_hash, is_succesful])
            return is_succesful.getvalue()


def join_lecture(lecture_id, user_id, user_type):
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            already_joined = cursor.var(int)
            cursor.callproc("join_lecture", [lecture_id, user_id, user_type, already_joined])
            return already_joined.getvalue()

