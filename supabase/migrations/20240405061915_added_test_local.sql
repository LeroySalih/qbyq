create table "public"."test_local" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "value" text
);


alter table "public"."test_local" enable row level security;

CREATE UNIQUE INDEX test_local_pkey ON public.test_local USING btree (id);

alter table "public"."test_local" add constraint "test_local_pkey" PRIMARY KEY using index "test_local_pkey";

grant delete on table "public"."test_local" to "anon";

grant insert on table "public"."test_local" to "anon";

grant references on table "public"."test_local" to "anon";

grant select on table "public"."test_local" to "anon";

grant trigger on table "public"."test_local" to "anon";

grant truncate on table "public"."test_local" to "anon";

grant update on table "public"."test_local" to "anon";

grant delete on table "public"."test_local" to "authenticated";

grant insert on table "public"."test_local" to "authenticated";

grant references on table "public"."test_local" to "authenticated";

grant select on table "public"."test_local" to "authenticated";

grant trigger on table "public"."test_local" to "authenticated";

grant truncate on table "public"."test_local" to "authenticated";

grant update on table "public"."test_local" to "authenticated";

grant delete on table "public"."test_local" to "service_role";

grant insert on table "public"."test_local" to "service_role";

grant references on table "public"."test_local" to "service_role";

grant select on table "public"."test_local" to "service_role";

grant trigger on table "public"."test_local" to "service_role";

grant truncate on table "public"."test_local" to "service_role";

grant update on table "public"."test_local" to "service_role";


