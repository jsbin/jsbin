alter table sandbox add column revision int default 1;
alter table sandbox add index revision (url, revision);