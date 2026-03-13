-- Run this in your Supabase SQL Editor to create the necessary table

create table public.ideas (
  "id" uuid primary key,
  "title" text not null,
  "domain" text not null,
  "problem" text not null,
  "solution" text not null,
  "whyNow" text not null,
  "submittedBy" text,
  "submittedAt" timestamp with time zone default now(),
  "implementationScore" numeric default 0,
  "scoreDetails" text,
  "approved" boolean default true
);

-- Turn on Row Level Security (RLS) allowing anonymous access for our app
alter table public.ideas enable row level security;

-- Create policy to allow anonymous inserts
create policy "Enable insert for anonymous users" on public.ideas
  for insert
  to anon
  with check (true);

-- Create policy to allow anonymous selects for approved ideas
create policy "Enable select for anonymous users" on public.ideas
  for select
  to anon
  using (approved = true);
