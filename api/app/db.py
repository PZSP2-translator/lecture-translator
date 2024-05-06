import getpass
import oracledb


import os
un = 'PZSP06'
cs = 'ora2.ia.pw.edu.pl/iais'
#pw = getpass.getpass(f'Enter password for {un}@{cs}: ')     # zaszyfrować i przesłać hasło do bazy
def load_password_from_file(path):
    return open(path, "r").read()
pw = load_password_from_file("app/password")

def setup_database():
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            pass
            # TODO implement executing sql
            # https://github.com/oracle/python-oracledb/blob/main/samples/sample_env.py
        connection.commit()


def get_courses():
    rows = []
    with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
        with connection.cursor() as cursor:
            for row in cursor.execute("select * from courses"):
                rows.append(row)
    return rows
