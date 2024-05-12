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
-- DECLARE
--     v_lecture_id INTEGER;
-- BEGIN
--     create_lecture('Nazwa wykładu', v_lecture_id);
--     DBMS_OUTPUT.PUT_LINE('v_lecture_id);
-- END;
-- /


-- funkcja do uwierzytelnienia użytkownika:
-- na wejście mail i hasło
-- na wyjście: id użytkownika lub brak w przypadku nieprawidłowych danych

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
-- DECLARE
--    u INTEGER;
-- BEGIN
--    u := login('jan@example.com', 'password123');
--    dbms_output.put_line(u);
-- END;
-- /





--TODO

-- na tworzeniu kursu dodać opcjonalny id wykładowcy albo ma zwracać id wykładu

-- procedura tworząca użytkownika sprawdza unikalność maila
-- na wejście: imię, nazwisko i mail, hasło


-- procedura zapisująca uczestnika na wykład
-- na wejście: id kursu, id użytkownika oraz typ użytkownika: S(student) lub L(wykładowca)


-- funkcja zwracająca transkrypcję danego wykładu
-- na wejście: id wykładu
-- na wyjście: tekst transkrypcji


-- funkcja zwracająca dostępne wykłady:
-- na wejście: id kursu
-- na wyjście: id wykładów

-- procedura do zmiany hasła