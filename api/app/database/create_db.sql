DROP TABLE TRANSCRIPTIONS;
DROP TABLE PARTICIPANTS;
DROP TABLE USERS;
DROP TABLE LECTURES;


CREATE TABLE lectures (
    lecture_id          INTEGER NOT NULL,
    title               VARCHAR2(30 CHAR) NOT NULL,
    lecture_date        DATE NOT NULL,
    lecturer_code       VARCHAR2(6 CHAR) NOT NULL UNIQUE,
    student_code        VARCHAR2(6 CHAR) NOT NULL UNIQUE,
    presentation_link   VARCHAR2(1000 CHAR)
);

ALTER TABLE lectures ADD CONSTRAINT lecture_pk PRIMARY KEY ( lecture_id );

CREATE TABLE participants (
    participant_id  INTEGER NOT NULL,
    user_type       VARCHAR2(1 CHAR) NOT NULL,
    lecture_id      INTEGER NOT NULL,
    user_id         INTEGER NOT NULL,
    note            CLOB
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
    password   VARCHAR2(100 CHAR) NOT NULL
);

ALTER TABLE users ADD CONSTRAINT user_pk PRIMARY KEY ( user_id );


ALTER TABLE participants
    ADD CONSTRAINT participant_lecture_fk FOREIGN KEY ( lecture_id )
        REFERENCES lectures ( lecture_id );

ALTER TABLE participants
    ADD CONSTRAINT participant_user_fk FOREIGN KEY ( user_id )
        REFERENCES users ( user_id );

ALTER TABLE transcriptions
    ADD CONSTRAINT transcription_lecture_fk FOREIGN KEY ( lecture_id )
        REFERENCES lectures ( lecture_id );