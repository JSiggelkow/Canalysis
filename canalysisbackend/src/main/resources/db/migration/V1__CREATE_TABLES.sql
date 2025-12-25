CREATE TABLE Keywords
(
    keyword  VARCHAR(255) PRIMARY KEY,
    language CHAR(2) CHECK ( language IN ('de', 'en'))
);

CREATE TABLE Prompts
(
    id       BIGSERIAL PRIMARY KEY,
    prompt   TEXT NOT NULL,
    language CHAR(2) CHECK ( language IN ('de', 'en')) NOT NULL
);