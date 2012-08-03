use todged;

alter table sandbox add column streaming char(1) default 'n';
alter table sandbox add column streaming_key char(32) not null;
alter table sandbox add column streaming_read_key char(32) not null;
alter table sandbox add column active_tab varchar(10) not null;
alter table sandbox add column active_cursor int not null;
alter table sandbox add index streaming_key (streaming_key);