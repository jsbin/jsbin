CREATE TABLE IF NOT EXISTS owners (
  id INTEGER NOT NULL,
  name VARCHAR(25) NOT NULL,
  url VARCHAR(255) NOT NULL,
  revision INTEGER DEFAULT '1',
  last_updated TIMESTAMP DEFAULT NULL,
  summary VARCHAR(255) NOT NULL DEFAULT '',
  html BOOLEAN DEFAULT '0',
  css BOOLEAN DEFAULT '0',
  javascript BOOLEAN DEFAULT '0',
  archive BOOLEAN DEFAULT '0'
);

CREATE SEQUENCE owners_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE owners_id_seq OWNED BY owners.id;
ALTER TABLE ONLY owners ALTER COLUMN id SET DEFAULT nextval('owners_id_seq'::regclass);
ALTER TABLE ONLY owners ADD CONSTRAINT owners_pkey PRIMARY KEY (id);

CREATE TABLE IF NOT EXISTS ownership (
  id INTEGER NOT NULL,
  name VARCHAR(50) NOT NULL,
  key VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL DEFAULT '',
  api_key VARCHAR(255) NULL,
  last_login TIMESTAMP NOT NULL,
  created TIMESTAMP NOT NULL,
  updated TIMESTAMP NOT NULL
);

CREATE SEQUENCE ownership_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE ownership_id_seq OWNED BY ownership.id;
ALTER TABLE ONLY ownership ALTER COLUMN id SET DEFAULT nextval('ownership_id_seq'::regclass);
ALTER TABLE ONLY ownership ADD CONSTRAINT ownership_pkey PRIMARY KEY (name);

CREATE TABLE IF NOT EXISTS sandbox (
  id INTEGER NOT NULL,
  html TEXT NOT NULL DEFAULT '',
  css TEXT NOT NULL DEFAULT '',
  javascript TEXT NOT NULL  DEFAULT '',
  created TIMESTAMP DEFAULT NULL,
  last_viewed TIMESTAMP DEFAULT NULL,
  url VARCHAR(255) DEFAULT NULL,
  active VARCHAR(1) DEFAULT 'y',
  reported TIMESTAMP DEFAULT NULL,
  streaming VARCHAR(1) DEFAULT 'n',
  streaming_key VARCHAR(32),
  streaming_read_key VARCHAR(32),
  active_tab VARCHAR(10),
  active_cursor INTEGER,
  revision INTEGER DEFAULT '1',
  settings TEXT NOT NULL DEFAULT ''
);

CREATE SEQUENCE sandbox_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE sandbox_id_seq OWNED BY sandbox.id;
ALTER TABLE ONLY sandbox ALTER COLUMN id SET DEFAULT nextval('sandbox_id_seq'::regclass);
ALTER TABLE ONLY sandbox ADD CONSTRAINT sandbox_pkey PRIMARY KEY (id);

CREATE TABLE IF NOT EXISTS forgot_tokens (
  owner_name VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires TIMESTAMP NOT NULL,
  created TIMESTAMP NOT NULL
);

CREATE INDEX sandbox_viewed ON sandbox USING btree (last_viewed);
CREATE INDEX sandbox_url ON sandbox USING btree (url);
CREATE INDEX sandbox_streaming_key ON sandbox USING btree (streaming_key);
CREATE INDEX sandbox_spam ON sandbox USING btree (created,last_viewed);
CREATE INDEX sandbox_revision ON sandbox USING btree (url,revision);
CREATE INDEX ownership_name_key ON ownership USING btree (name,key);
CREATE INDEX ownership_api_key ON ownership USING btree (api_key);
CREATE INDEX owners_name_url ON owners USING btree (name,url,revision);
CREATE INDEX index_owners_last_updated ON owners USING btree (name, last_updated);
CREATE INDEX index_expires ON forgot_tokens USING btree (expires);
CREATE INDEX index_token_expires ON forgot_tokens USING btree (token,created,expires);
