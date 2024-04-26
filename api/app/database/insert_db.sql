INSERT INTO courses (course_id, name, code) VALUES (1, 'Informatyka', 'AHW128');

INSERT INTO lectures (lecture_id, title, lecture_date, course_id) VALUES (1, 'Wprowadzenie do programowania', '2024-04-15', 1);
INSERT INTO lectures (lecture_id, title, lecture_date, course_id) VALUES (2, 'Podstawy baz danych', '2024-04-16', 1);
INSERT INTO lectures (lecture_id, title, lecture_date, course_id) VALUES (3, 'Algorytmy i struktury danych', '2024-04-17', 1);

INSERT INTO users (user_id, first_name, last_name, mail, password) VALUES (1, 'Jan', 'Kowalski', 'jan@example.com', 'password123');
INSERT INTO users (user_id, first_name, last_name, mail, password) VALUES (2, 'Anna', 'Nowak', 'anna@example.com', 'securepassword');
INSERT INTO users (user_id, first_name, last_name, mail, password) VALUES (3, 'Adam', 'Nowicki', 'adam@example.com', 'strongpassword');

INSERT INTO participants (participant_id, user_type, course_id, user_id) VALUES (1, 'S', 1, 1);
INSERT INTO participants (participant_id, user_type, course_id, user_id) VALUES (2, 'L', 1, 3);
INSERT INTO participants (participant_id, user_type, course_id, user_id) VALUES (3, 'S', 1, 2);