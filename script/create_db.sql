create table users
(
  id serial primary key,
  first_name varchar(255),
  last_name varchar(255),
  name_business varchar(255),
  city varchar(255),
  state varchar(255),
  email varchar(255),
  password_hash varchar(255)
);

create table age_groups (
  id serial primary key,
  user_id int,
  min_age int,
  max_age int,
  max_child_count int,
  name varchar(255)
);

create table kids (
  id serial primary key,
  user_id int,
  first_name varchar(255),
  last_name varchar(255),
  birthday date
);
