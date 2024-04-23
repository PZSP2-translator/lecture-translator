CREATE TABLE courses (
    course_id INTEGER NOT NULL,
    name      VARCHAR2(20 CHAR) NOT NULL,
    code      VARCHAR2(6 CHAR) NOT NULL
);

ALTER TABLE courses ADD CONSTRAINT course_pk PRIMARY KEY ( course_id );

CREATE TABLE lectures (
    lecture_id   INTEGER NOT NULL,
    title        VARCHAR2(30 CHAR),
    lecture_date DATE NOT NULL,
    course_id    INTEGER NOT NULL
);

ALTER TABLE lectures ADD CONSTRAINT lecture_pk PRIMARY KEY ( lecture_id );

CREATE TABLE participants (
    participant_id INTEGER NOT NULL,
    user_type      VARCHAR2(1 CHAR) NOT NULL,
    course_id      INTEGER NOT NULL,
    user_id        INTEGER NOT NULL
);

ALTER TABLE participants ADD CONSTRAINT participant_pk PRIMARY KEY ( participant_id );

CREATE TABLE transcriptions (
    transcription_id INTEGER NOT NULL,
    text             CLOB NOT NULL,
    time             TIMESTAMP NOT NULL,
    lecture_id       INTEGER NOT NULL
);

ALTER TABLE transcriptions ADD CONSTRAINT transcription_pk PRIMARY KEY ( transcription_id );

CREATE TABLE users (
    user_id    INTEGER NOT NULL,
    first_name VARCHAR2(20 CHAR) NOT NULL,
    last_name  VARCHAR2(20 CHAR) NOT NULL,
    mail       VARCHAR2(40 CHAR) NOT NULL,
    password   VARCHAR2(30 CHAR) NOT NULL
);

ALTER TABLE users ADD CONSTRAINT user_pk PRIMARY KEY ( user_id );

ALTER TABLE lectures
    ADD CONSTRAINT lecture_course_fk FOREIGN KEY ( course_id )
        REFERENCES courses ( course_id );

ALTER TABLE participants
    ADD CONSTRAINT participant_course_fk FOREIGN KEY ( course_id )
        REFERENCES courses ( course_id );

ALTER TABLE participants
    ADD CONSTRAINT participant_user_fk FOREIGN KEY ( user_id )
        REFERENCES users ( user_id );

ALTER TABLE transcriptions
    ADD CONSTRAINT transcription_lecture_fk FOREIGN KEY ( lecture_id )
        REFERENCES lectures ( lecture_id );