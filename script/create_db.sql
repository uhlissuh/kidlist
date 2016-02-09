create table users (
  id serial primary key,
  first_name varchar(255),
  last_name varchar(255),
  name_business varchar(255),
  city varchar(255),
  state varchar(255),
  email varchar(255),
  password_hash varchar(255)
);

create table kids (
  user_id varchar(255),
  child_first_name varchar(255),
  child_last_name varchar(255),
  mother_first_name varchar(255),
  mother_last_name varchar(255),
  father_first_name varchar(255),
  father_last_name varchar(255),
  birthday date,
  enrollment_date date,
  departure_date date
);
