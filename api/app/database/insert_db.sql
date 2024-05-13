INSERT INTO lectures (lecture_id, title, lecture_date, lecturer_code, student_code) VALUES (1, 'Wprowadzenie do programowania', TO_DATE('2024-04-17', 'YYYY-MM-DD'), 'bcdef', 'bcdef');
INSERT INTO lectures (lecture_id, title, lecture_date, lecturer_code, student_code) VALUES (2, 'Podstawy baz danych', TO_DATE('2024-04-17', 'YYYY-MM-DD'), 'bcdea', 'bcdea');
INSERT INTO lectures (lecture_id, title, lecture_date, lecturer_code, student_code) VALUES (3, 'Algorytmy i struktury danych', TO_DATE('2024-04-17', 'YYYY-MM-DD'), 'bcdeb', 'bcdeb');

INSERT INTO users (user_id, first_name, last_name, mail, password) VALUES (1, 'Jan', 'Kowalski', 'jan@example.com', 'password123');
INSERT INTO users (user_id, first_name, last_name, mail, password) VALUES (2, 'Anna', 'Nowak', 'anna@example.com', 'securepassword');
INSERT INTO users (user_id, first_name, last_name, mail, password) VALUES (3, 'Adam', 'Nowicki', 'adam@example.com', 'strongpassword');

INSERT INTO participants (participant_id, user_type, lecture_id, user_id) VALUES (1, 'S', 1, 1);
INSERT INTO participants (participant_id, user_type, lecture_id, user_id) VALUES (2, 'L', 2, 3);
INSERT INTO participants (participant_id, user_type, lecture_id, user_id) VALUES (3, 'S', 1, 2);