-- CREATE DATABASE

create database hirejob;
\l
\c hirejob

-- CREATE ENUM

create type job_type as enum(
    'Freelance', 
    'Full-time', 
    'Part-time',
    'Internship',
    'Contract'
);

create type reason as enum(
    'Project', 
    'Full-time', 
    'Part-time',
    'Internship',
    'Contract'
);

create type portfolio_type as enum(
    'Mobile', 
    'Web',
    'Desktop',
    'Other'
);

-- CREATE TABLE

create table workers(
    id varchar(36) not null primary key,
    name varchar(40) not null,
    email varchar(60) not null unique,
    phone_number varchar(16) not null,
    password varchar(128) not null,
    image varchar default('worker.png'),
    jobdesk varchar(40),
    residence varchar(40),
    workplace varchar(40),
    description text,
    job_type job_type,
    instagram varchar(40),
    github varchar(40),
    gitlab varchar(40)
);

create table skills(
    id varchar(36) not null primary key,
    name varchar(20) not null
);

create table worker_skills(
    id varchar(36) not null primary key,
    id_worker varchar(36) references workers on update cascade on delete cascade,
    foreign key (id_worker) references workers(id),
    id_skill varchar(36) references skills update cascade on delete cascade,
    foreign key (id_skill) references skills(id)
);

create table portfolios(
    id varchar(36) not null primary key,
    id_worker varchar(36) references workers on update cascade on delete cascade,
    foreign key (id_worker) references workers(id),
    name varchar(40) not null,
    repo_link varchar not null,
    portfolio_type portfolio_type not null,
    image varchar not null
);

create table work_experiences(
    id varchar(36) not null primary key,
    id_worker varchar(36) references workers on update cascade on delete cascade,
    foreign key (id_worker) references workers(id),
    jobdesk varchar(40) not null,
    company_name varchar(40) not null,
    date_start varchar not null,
    date_end varchar,
    description text not null,
    image varchar default('company.png')
);

create table recruiters(
    id varchar(36) not null primary key,
    name varchar(40) not null,
    email varchar(60) not null unique,
    company_name varchar(40) not null,
    jobdesk varchar(40) not null,
    phone_number varchar(16) not null,
    password varchar(128) not null,
    image varchar default('recruiter.png'),
    company_field varchar(40),
    workplace varchar(40),
    description text,
    instagram varchar(40),
    linkedin varchar(40),
    banner_image varchar default('banner.png')
);

create table hire(
    id varchar(36) not null primary key,
    id_worker varchar(36) references workers on update cascade on delete cascade,
    foreign key (id_worker) references workers(id),
    id_recruiter varchar(36) references recruiters on update cascade on delete cascade,
    foreign key (id_recruiter) references recruiters(id),
    reason reason not null,
    name varchar(40) not null,
    email varchar(60) not null,
    phone_number varchar(16) not null,
    description text,
    read_status boolean not null,
    created_at varchar not null,
    updated_at varchar not null
);