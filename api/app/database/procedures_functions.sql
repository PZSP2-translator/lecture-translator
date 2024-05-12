-- procedura tworząca kurs:
-- na wejście nazwa kursu
-- na wyjście: id utworzonego kursu

CREATE SEQUENCE lecture_id_seq START WITH 1;

CREATE OR REPLACE PROCEDURE create_lecture(p_title IN VARCHAR2, p_lecture_id OUT INTEGER) AS
    v_lecturer_code VARCHAR2(6 CHAR);
    v_student_code VARCHAR2(6 CHAR);
    v_code_exists INTEGER;
BEGIN
    SELECT lecture_id_seq.NEXTVAL INTO p_lecture_id FROM DUAL;

    LOOP
        v_lecturer_code := DBMS_RANDOM.STRING('A',6);
        SELECT COUNT(*) INTO v_code_exists FROM lectures WHERE lecturer_code = v_lecturer_code;
        EXIT WHEN v_code_exists = 0;
    END LOOP;

    LOOP
        v_student_code := DBMS_RANDOM.STRING('A',6);
        SELECT COUNT(*) INTO v_code_exists FROM lectures WHERE student_code = v_student_code;
        EXIT WHEN v_code_exists = 0;
    END LOOP;

    INSERT INTO lectures (lecture_id, title, lecture_date, lecturer_code, student_code)
    VALUES (p_lecture_id, p_title, SYSTIMESTAMP, v_lecturer_code, v_student_code);
    COMMIT;
END;
/

-- funkcja do uwierzytelnienia użytkownika:
-- na wejście mail i hasło
-- na wyjście: id użytkownika lub 0 w przypadku nieprawidłowych danych

CREATE OR REPLACE FUNCTION login(mail VARCHAR2, pass VARCHAR2)
RETURN INTEGER
AS
    v_user_id INTEGER := 0;
BEGIN
   SELECT user_id INTO v_user_id
   FROM users
   WHERE mail = mail AND password = pass;

   RETURN v_user_id;

EXCEPTION
   WHEN NO_DATA_FOUND THEN
       RETURN v_user_id;
END;
/

-- procedura tworząca użytkownika sprawdza unikalność maila
-- na wejście: imię, nazwisko i mail, hasło
-- na wyjśćie 0 gdy pomyślnie utworzono, 1 gdy nie utworzono, ten sam mail istnieje

CREATE SEQUENCE user_id_seq START WITH 1;

CREATE OR REPLACE PROCEDURE create_user(first_name IN VARCHAR2, last_name IN VARCHAR2, email IN VARCHAR2, pass_hash IN VARCHAR2, mail_exist OUT NUMBER) AS
    v_mail_count NUMBER;
    v_user_id INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_mail_count FROM users WHERE mail = email;

    IF v_mail_count = 0 THEN
        SELECT lecture_id_seq.NEXTVAL INTO v_user_id FROM DUAL;
        INSERT INTO users (user_id, first_name, last_name, mail, password)
        VALUES (v_user_id, first_name, last_name, email, pass_hash);
        COMMIT;
        mail_exist := 0;
    ELSE
        mail_exist := 1;
    END IF;
END;
/


-- procedura zapisująca uczestnika na wykład
-- na wejście: id kursu, id użytkownika oraz typ użytkownika: S(student) lub L(wykładowca)
-- na wyjście: 0 gdy poprawnie dołączono, 1 gdy użytkownik był już zapisany

CREATE SEQUENCE participant_id_seq START WITH 1;

CREATE OR REPLACE PROCEDURE join_lecture(id_lecture IN INTEGER, id_user IN INTEGER, user_type IN VARCHAR2, already OUT NUMBER)
AS
    p_participant_id INTEGER;
    v_already_joined NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_already_joined
    FROM PARTICIPANTS
    WHERE lecture_id = id_lecture AND user_id = id_user;

     IF v_already_joined = 0 THEN
        SELECT PARTICIPANT_ID_SEQ.nextval INTO p_participant_id FROM DUAL;
        INSERT INTO PARTICIPANTS (participant_id, user_type, lecture_id, user_id)
            VALUES (p_participant_id, user_type, id_lecture, id_user);
        COMMIT;
        already := 0;
    ELSE
        already := 1;
    END IF;
END;
/


-- funkcja zwracająca transkrypcję danego wykładu
-- na wejście: id wykładu
-- na wyjście: tekst transkrypcji


-- funkcja zwracająca dostępne wykłady:
-- na wejście: id kursu
-- na wyjście: id wykładów

-- procedura do zmiany hasła

-- procedura do dodania transkrypcji

-- procedura dodająca prezentację do wykładu

-- pytania przechowujemy tylko w api