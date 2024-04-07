
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "dailyquestion";

ALTER SCHEMA "dailyquestion" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "tablefunc" WITH SCHEMA "public";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."dq_loadquestionbyspecitemidreturn" AS (
	"id" bigint,
	"created_at" timestamp with time zone,
	"createdby" "text",
	"specitemid" bigint,
	"questiondata" "json",
	"questiontype" bigint,
	"correctanswer" "json",
	"tag" "text",
	"title" "text",
	"spectitle" "text"
);

ALTER TYPE "public"."dq_loadquestionbyspecitemidreturn" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."dq_getspecitemquestioncount"("_specid" integer) RETURNS TABLE("specid" bigint, "specitemid" bigint, "title" character varying, "subject" character varying, "tag" character varying, "specitem_title" character varying, "questiondatacount" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    select s.id as "specid", si.id as "specitemid", s.title, s.subject, si.tag, si.title as "specitem_title", sum(case when q."questionData" is not null then 1 else 0 end)::int as questionDataCount
	from "SpecItem" si 
	left join "Spec" s on si."SpecId" = s.id
	left join "dqQuestions" q on si.id = q."specItemId"
	where s.id = _specid
	group by s.id, si.id, s.title, s.subject, si.tag, si.title
	order by s.title, s.subject, si.tag;
END;
$$;

ALTER FUNCTION "public"."dq_getspecitemquestioncount"("_specid" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."dq_loadnextquestionbycode"("_code" "text", "_owner" "text") RETURNS TABLE("id" bigint, "question_text" "text", "choices" "text"[], "correct_answer" "text")
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  result_record dq_loadQuestionBySpecItemIdReturn;
 
begin

	return query
	select dq.id, dq.question_text,dq.choices,  dq.correct_answer 
	from "dqQuestions" as dq 
	where dq."code" = _code and dq.id not in (
		select "questionId" 
		from "dqAnswers" da  
		where owner = _owner
	);

end;
$$;

ALTER FUNCTION "public"."dq_loadnextquestionbycode"("_code" "text", "_owner" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."dq_loadnextquestionbyspecitem"("_specitemid" bigint, "_owner" "text") RETURNS "public"."dq_loadquestionbyspecitemidreturn"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  result_record dq_loadQuestionBySpecItemIdReturn;
 
begin
	/*
  SELECT 
 	Q."id", Q."created_at", 
 	Q."createdBy", Q."specItemId", 
 	Q."questionData", Q."questionType", Q."correctAnswer", 
	si.tag, si.title, s.title as "specTitle" 	
 	into result_record
 	FROM "dqQuestions" as Q
 	left join "SpecItem" si on Q."specItemId" = si.id
 	left join "Spec" as s on si."SpecId" = s.id
 	left join "dqAnswers" as a on q."id" = a."questionId"
 	WHERE q."specItemId" = _specitemid
 	and a.id is null
  	order by Q."created_at";
  */
  
  	select Q."id",  Q."created_at", 
 	Q."createdBy", Q."specItemId", 
 	Q."questionData", Q."questionType", Q."correctAnswer", 
	si.tag, si.title, s.title as "specTitle"
	from "dqQuestions" as Q 
	into result_record
	left join "SpecItem" si on Q."specItemId" = si.id
 	left join "Spec" as s on si."SpecId" = s.id
 	left outer join (
 	
 		select da.owner, da."questionId", da.created_at  
 		from "dqAnswers"	as da
 		where da."owner" = _owner
 	) as a 
 	on Q."id" = a."questionId"
 	where Q."specItemId" = _specitemid 
	order by coalesce(a.created_at, '2000-01-01') asc;
	
 	
   return result_record;
END;
$$;

ALTER FUNCTION "public"."dq_loadnextquestionbyspecitem"("_specitemid" bigint, "_owner" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."dq_loadquestionbyid"("_questionid" bigint) RETURNS "public"."dq_loadquestionbyspecitemidreturn"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  result_record dq_loadQuestionBySpecItemIdReturn;
 
BEGIN
  SELECT 
 	Q."id", Q."created_at", 
 	Q."createdBy", Q."specItemId", 
 	Q."questionData", Q."questionType", Q."correctAnswer", 
	si.tag, si.title, s.title as "specTitle" 	
 	into result_record
 	FROM "dqQuestions" as Q
 	left join "SpecItem" si on Q."specItemId" = si.id
 	left join "Spec" as s on si."SpecId" = s.id
 	WHERE Q."id" = _questionid
 	order by Q."created_at"
 	limit 1;
 
   return result_record;
END;
$$;

ALTER FUNCTION "public"."dq_loadquestionbyid"("_questionid" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."dq_loadquestionbyspecitemid"("_specitemid" bigint) RETURNS "public"."dq_loadquestionbyspecitemidreturn"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  result_record dq_loadQuestionBySpecItemIdReturn;
 
BEGIN
  SELECT 
 	Q."id", Q."created_at", 
 	Q."createdBy", Q."specItemId", 
 	Q."questionData", Q."questionType", Q."correctAnswer", 
	si.tag, si.title, s.title as "specTitle" 	
 	into result_record
 	FROM "dqQuestions" as Q
 	left join "SpecItem" si on Q."specItemId" = si.id
 	left join "Spec" as s on si."SpecId" = s.id
 	WHERE Q."specItemId" = _specitemid
 	order by Q."created_at"
 	limit 1;
 
   return result_record;
END;
$$;

ALTER FUNCTION "public"."dq_loadquestionbyspecitemid"("_specitemid" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_admin_get_all_papers_for_class_spec"("classTag" "text") RETURNS TABLE("paperId" bigint, "year" "text", "month" "text", "title" "text", "paper" "text", "availablefrom" timestamp with time zone, "completeby" timestamp with time zone, "markby" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
begin
return query
select p.id as "paperId", p.year::text, p.month::text, p.title::text, p.paper::text , cp1."availableFrom", cp1."completeBy", cp1."markBy"
from "Papers" p
left join (

	select * 
	from "ClassPapers" cp 
	where cp."classId" = (select id from "Classes" c  where c.tag = "classTag")

) cp1 on p.id = cp1."paperId"
where "specId" = (select "specId" from "Classes" c where c.tag = "classTag");
end;
$$;

ALTER FUNCTION "public"."fn_admin_get_all_papers_for_class_spec"("classTag" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_admin_get_papers_for_class"("_classid" integer) RETURNS TABLE("paperId" integer, "year" "text", "month" "text", "subject" "text", "paper" "text", "qpaperlabel" "text", "apaperlabel" "text", "availableFrom" timestamp with time zone, "completeBy" timestamp with time zone, "markBy" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
	declare 
		_specid int := 0;
	    	
	begin 

		select "specId" from "Classes" where id = _classid into _specid;
	
		return QUERY
		select p.id::int as "paperId", p."year"::text, p."month"::text, p."subject"::text, p."paper"::text, p."qPaperLabel", p."aPaperLabel", 
			   cp."availableFrom", cp."completeBy", cp."markBy" 
		from "Papers" p 
		left join (
			select cp2."paperId", cp2."classId", cp2."availableFrom", cp2."completeBy", cp2."markBy" 
			from "ClassPapers" cp2 
			where cp2."classId" = _classid) cp ON p."id" = cp."paperId"
		where p."specId" = _specid
		order by cp."availableFrom";
	
	end
$$;

ALTER FUNCTION "public"."fn_admin_get_papers_for_class"("_classid" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_check_class"("classid" integer) RETURNS TABLE("pupilId" "uuid", "firstName" "text", "familyName" "text", "classId" bigint, "paperId" bigint, "year" "text", "month" "text", "paper" "text", "pMarks" integer)
    LANGUAGE "plpgsql"
    AS $$
begin
	return QUERY
	select cm."pupilId",  
			profile."firstName", 
			profile."familyName", 
			cm."classId",
			d."paperId" as "paperId", 
			d."year" as "year",
			d."month",
			d."paper", 
			d."pMarks"::int as "pMarks"
	from "ClassMembership" cm
	left join (
	
	  select pm."userId",  pa.id as "paperId", pa."year"::text, pa."month"::text, pa."paper"::text, sum(pm."marks") as "pMarks"
	  from "PupilMarks" pm
	  left join "Papers" pa on pm."paperId" = pa."id"
	  where pa.id in (select cp."paperId" from "ClassPapers" cp where cp."classId" = classid)
	  group by pm."userId", pa."id"
	
	) d on cm."pupilId" = d."userId"
	left join "Profile" as profile on cm."pupilId" = profile."id"
	where cm."classId" = classid
	order by cm."pupilId", d."paperId";

end;
$$;

ALTER FUNCTION "public"."fn_check_class"("classid" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_check_class_spec_item"("classid" integer) RETURNS TABLE("pupilId" "uuid", "firstName" "text", "familyName" "text", "tag" "text", "title" "text", "pMarks" bigint, "qMarks" bigint)
    LANGUAGE "plpgsql"
    AS $$
begin 
	return QUERY
	select
		p."id" as "pupilId",
		p."firstName"::text, 
		p."familyName"::text, 
		si."tag"::text, 
		"si"."title"::text, 
		sum(pm.marks)::bigint as "pMarks", 
		sum(q.marks)::bigint as "qMarks"  
	from "PupilMarks" pm
	left join "Profile" p on pm."userId" = p."id"
	left join "Questions" q on pm."questionId" = q."id"
	left join "SpecItem" si on q."specItemId" = si."id"
	where si."SpecId" in (select "specId" from "Classes" where "id" = classid)
	and pm."userId" in (select cm3."pupilId" from "ClassMembership" cm3 where "classId" = classid)
	group by p.id, pm."userId", p."firstName", p."familyName", si."tag", si."title"
	order by pm."userId", si."tag";
 
end;
$$;

ALTER FUNCTION "public"."fn_check_class_spec_item"("classid" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_check_paper_for_class"("paperid" integer, "classid" integer) RETURNS TABLE("pupilId" "uuid", "firstName" "text", "familyName" "text", "pMarks" integer)
    LANGUAGE "plpgsql"
    AS $$
begin
	return QUERY
	select cm."pupilId",  profile."firstName", profile."familyName", d."pMarks"::int as "pMarks"
	from "ClassMembership" cm
	left join (
	
	  select pm."userId",  sum(pm."marks") as "pMarks"
	  from "PupilMarks" pm
	  left join "Papers" pa on pm."paperId" = pa."id" 
	  
	  where pa.id = paperid
	  group by pm."userId"
	
	) d on cm."pupilId" = d."userId"
	left join "Profile" as profile on cm."pupilId" = profile."id"
	where cm."classId" = classid
	order by d."pMarks";

end;
$$;

ALTER FUNCTION "public"."fn_check_paper_for_class"("paperid" integer, "classid" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_fc_add_spec_item_to_pupil_queue"("_userid" "uuid", "_specitemid" integer) RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
begin 

	/* Add the specitem to the list of available specItems in the user's queue */
	insert into "FCUserQueues" ("userid", "specItemId") values (_userid, _specItemId);

    /* Add the questions to the queue */
	insert into "FCUSerQueueEntries"("userId", "specItemId" , "dueDate", "currentQueue" , "questionId")  
	select _userid, _specItemId, NOW() - INTERVAL '1 DAY', 0, FCQ."id"
	from "FCQuestions" as FCQ
	where "specItemId" = _specItemId;

	
	return 1;
end;
$$;

ALTER FUNCTION "public"."fn_fc_add_spec_item_to_pupil_queue"("_userid" "uuid", "_specitemid" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_fc_get_distractors"("_specid" bigint, "_qid" "uuid") RETURNS "text"[]
    LANGUAGE "plpgsql"
    AS $$
declare 
	result text[];

begin
	
	select array (select term
	from "FCQuestions"
	where "specItemId" = _specid and id!=_qid
	order by (random() * 10)::int
	limit 3
	)
	into result;

	return result;
end;
$$;

ALTER FUNCTION "public"."fn_fc_get_distractors"("_specid" bigint, "_qid" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_fc_get_next_question"("_userid" "uuid", "_specitemid" integer) RETURNS TABLE("userId" "uuid", "specItemId" bigint, "tag" "text", "title" "text", "dueDate" timestamp with time zone, "currentQueue" integer, "history" "json", "questionId" "uuid", "term" "text", "text" "text", "distractors" "text"[])
    LANGUAGE "plpgsql"
    AS $$
begin
	return QUERY

	select 	fqe."userId", 
			fqe."specItemId", 
			si."tag"::text, 
			si."title"::text, 
			fqe."dueDate", 
			fqe."currentQueue"::int, 
			fqe."history", 
			fqe."questionId",
			fq."term",
			fq."text",
			fn_fc_get_distractors(fqe."specItemId", fqe."questionId") as "distractors"
	from "FCUSerQueueEntries" fqe
	left join "SpecItem" si ON fqe."specItemId" = si.id 
	left join "FCQuestions" fq ON fqe."questionId" = fq.id
	where fqe."userId" = _userid and fqe."specItemId" = _specitemid and fqe."dueDate" < now() 
	order by "dueDate" ASC
	limit 1
	; 

end;
$$;

ALTER FUNCTION "public"."fn_fc_get_next_question"("_userid" "uuid", "_specitemid" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_fc_get_queue"("_userid" "uuid", "_specitemid" integer) RETURNS TABLE("userId" "uuid", "specItemId" bigint, "tag" "text", "title" "text", "dueDate" timestamp with time zone, "currentQueue" integer, "history" "json", "questionId" "uuid", "term" "text", "text" "text", "distractors" "text"[])
    LANGUAGE "plpgsql"
    AS $$
begin
	return QUERY

	select 	fqe."userId", 
			fqe."specItemId", 
			si."tag"::text, 
			si."title"::text, 
			fqe."dueDate", 
			fqe."currentQueue"::int, 
			fqe."history", 
			fqe."questionId",
			fq."term",
			fq."text",
			fn_fc_get_distractors(fqe."specItemId", fqe."questionId") as "distractors"
	from "FCUSerQueueEntries" fqe
	left join "SpecItem" si ON fqe."specItemId" = si.id 
	left join "FCQuestions" fq ON fqe."questionId" = fq.id
	where fqe."userId" = _userid and fqe."specItemId" = _specitemid
	; 

end;
$$;

ALTER FUNCTION "public"."fn_fc_get_queue"("_userid" "uuid", "_specitemid" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_fc_get_queue_summary"("_userid" "uuid", "_specitemid" integer) RETURNS TABLE("isDue" "text", "count" integer)
    LANGUAGE "plpgsql"
    AS $$
begin
	return QUERY

	select "case"::text as "isDue", count(*)::int
	from (
	select "userId", "dueDate", case  
		when now() > "dueDate" then true 
		else false END
	from "FCUSerQueueEntries"
	where "userId"=_userid and "specItemId" = _specitemid
	) as D
	group by "case";

end;
$$;

ALTER FUNCTION "public"."fn_fc_get_queue_summary"("_userid" "uuid", "_specitemid" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_fc_get_queues"("_userid" "uuid") RETURNS TABLE("specItemId" bigint, "specItemTag" "text", "specItemTitle" "text", "specId" bigint, "specTitle" "text", "specSubject" "text")
    LANGUAGE "plpgsql"
    AS $$
begin
	return QUERY

	select si.id::bigint as "specItemId", 
	si.tag::text as "specItemTag", 
	si.title::text as "specTitle", 
	s.id::bigint as "specId", 
    s.title::text as "specTitle", 
	s.subject::text as "specSubject" 
	from "FCUserQueues" as uq
	left join "SpecItem" as si on uq."specItemId" = si."id"
	left join "Spec" as s on si."SpecId" = s.id 
	where uq.userid = _userid;

end;
$$;

ALTER FUNCTION "public"."fn_fc_get_queues"("_userid" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_get_paper_data_for_pupil"("pupilid" "uuid") RETURNS TABLE("classId" bigint, "classTag" "text", "specId" bigint, "pupilId" "uuid", "firstName" "text", "familyName" "text", "paperId" bigint, "year" "text", "month" "text", "paper" "text", "availableFrom" timestamp with time zone, "completeBy" timestamp with time zone, "markBy" timestamp with time zone, "qMarks" bigint, "pMarks" bigint)
    LANGUAGE "plpgsql"
    AS $$
begin
	return QUERY
	
			select c.id as "classId",
			c.tag as "classTag",
			c."specId" as "specId",
			
			pp."id" as "pupilId", pp."firstName", pp."familyName", 
			p."id" as "paperId", p."year"::text, p."month"::text, p."paper"::text,
			cp."availableFrom", cp."completeBy", cp."markBy",
			p."marks" as "qMarks", marks."pMarks"
	from "Papers" p
	left join "ClassPapers" cp on p.id = cp."paperId"
	left join "Classes" c on cp."classId" = c."id"
	left join "ClassMembership" cm on  c.id = cm."classId"
	left join "Profile" pp on cm."pupilId" = pp."id"
	left join (
	
			select pm."userId" as "pupilId", q."PaperId" as "paperId",  sum(q."marks")::bigint as "qMarks"  , sum(pm."marks")::bigint as "pMarks"
			from "PupilMarks" pm 
			left join "Questions" q on pm."questionId"  = q."id"
			where pm."userId" = pupilid
			group by pm."userId", q."PaperId"
	
	) as marks on pp."id" = marks."pupilId" and p."id" = marks."paperId"
	where cm."pupilId" = pupilid
	order by c."tag", p."id", cp."completeBy";

end;
$$;

ALTER FUNCTION "public"."fn_get_paper_data_for_pupil"("pupilid" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_get_paper_details_for_pupil"("_owner" "uuid") RETURNS TABLE("classId" bigint, "paperId" bigint, "paperTitle" "text", "classTag" "text", "availableFrom" "date", "completeBy" "date", "markBy" "date", "paperMarks" bigint, "pupilMarks" bigint)
    LANGUAGE "plpgsql"
    AS $$

begin

	-- get classes for pupil
	return query
	select cp."classId" as "classId",
		   cp."paperId" as "pupilId",
		   p.year || '-'|| p.month || '-' ||p.paper as "paperTitle",
		   c."tag" as "classTag",
		   cp."availableFrom"::date as "availableFrom",
		   cp."completeBy"::date as "completeBy",
		   cp."markBy"::date as "markBy",
		   p.marks::bigint as "paperMarks",
		   pupilMarks.marks as "pupilMarks"
	from "ClassPapers" cp 
	left join "Papers" p on cp."paperId" = p.id 
	left join "Classes" c on cp."classId" = c.id
	left join (
	
		-- calculate marks for paper
		select pm2."userId" as "pupilId", pm2."paperId", sum(pm2.marks)::bigint as marks
		from "PupilMarks" pm2
		where pm2."userId" = _owner
		group by pm2."userId", pm2."paperId"
	
	) pupilMarks on p.id = pupilMarks."paperId"
	where cp."classId" in (					-- restrict to classes for the _owner 
		select cm."classId"
		from "ClassMembership" cm 
		where cm."pupilId" = _owner 
	)
	and cp."availableFrom" is not null
	;
	
end;
$$;

ALTER FUNCTION "public"."fn_get_paper_details_for_pupil"("_owner" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_get_papers_for_class"("_classid" integer) RETURNS TABLE("paperId" integer, "year" "text", "month" "text", "subject" "text", "paper" "text", "qpaperlabel" "text", "apaperlabel" "text", "availableFrom" timestamp with time zone, "completeBy" timestamp with time zone, "markBy" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
	declare 
		_specid int := 0;
	    	
	begin 

		select "specId" from "Classes" where id = _classid into _specid;
	
		return QUERY
		select p.id::int as "paperId", p."year"::text, p."month"::text, p."subject"::text, p."paper"::text, p."qPaperLabel", p."aPaperLabel", 
			   cp."availableFrom", cp."completeBy", cp."markBy" 
		from "Papers" p 
		left join (
			select cp2."paperId", cp2."classId", cp2."availableFrom", cp2."completeBy", cp2."markBy" 
			from "ClassPapers" cp2 
			where cp2."classId" = _classid) cp ON p."id" = cp."paperId"
		where p."specId" = _specid
		order by p.id;
	
	end
$$;

ALTER FUNCTION "public"."fn_get_papers_for_class"("_classid" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_get_pupil_marks_for_assigned_papers_by_class"("_pupilid" "text", "_classid" bigint) RETURNS TABLE("classid" bigint, "paperid" bigint, "markby" "date", "answermarks" bigint)
    LANGUAGE "plpgsql"
    AS $$
begin 
	
	return query
	select cp."classId", cp."paperId", cp."markBy"::date, pupilMarks."answerMarks"::bigint 
	from "ClassPapers" cp 
	left join (
		select p.id as "paperId", sum(pm.marks) as "answerMarks"
		from "PupilMarks" pm
		left join "Papers" p on pm."paperId" = p.id 
		left join "ClassPapers" cp on p.id = cp."paperId"  
		where "userId"::text = _pupilId::text
		and cp."classId" = _classid
		group by p.id
	) pupiLMarks on cp."paperId" = pupilMarks."paperId"
	where cp."classId" = _classid  and cp."markBy" is not null
	order by cp."classId" , cp."markBy";

end;
$$;

ALTER FUNCTION "public"."fn_get_pupil_marks_for_assigned_papers_by_class"("_pupilid" "text", "_classid" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_get_specitemmarks_for_pupil_class"("_pupilid" "text", "_classid" bigint) RETURNS TABLE("_specId" bigint, "_specItemId" bigint, "_specItemTag" "text", "_specItemTitle" "text", "_questionMarks" bigint, "_answerMarks" bigint)
    LANGUAGE "plpgsql"
    AS $$
	declare __specId bigint;
begin
	
	select c."specId"
	into __specId
	from "Classes" c
	where c."id" = _classId;

	return Query
	select si."SpecId" as "specId", 
		   si."id" as "specItemId", 
		   si."tag"::text as "specItemTag", 
		   si."title"::text as "specItemTitle", 
		   "questionMarks"."qMarks"::bigint as "questionMarks", 
		   pm."answerMarks"::bigint
	from "SpecItem" si
	left join (
	
		select "specItemId", sum("questionMarks") as "questionMarks", sum("answerMarks") as "answerMarks"
		from vw_pupil_marks_denormed vpmd 
		where 
			vpmd."pupilId"::text =_pupilId
			and vpmd."classId"=_classId
		group by vpmd."specItemId"
	
	) pm on si."id" = pm."specItemId"
	left join (
		
		select q."specItemId", sum(q.marks) as "qMarks" 
		from "ClassPapers" cp 
		left join "Classes" c on cp."classId" = c.id 
		left join "Questions" q on cp."paperId" = q."PaperId" 
		where c.id = _classId
		group by q."specItemId" 
	
	) "questionMarks" on si.id = "questionMarks"."specItemId"
	where si."SpecId" = __specId
	order by si."tag";
end;
$$;

ALTER FUNCTION "public"."fn_get_specitemmarks_for_pupil_class"("_pupilid" "text", "_classid" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_marks_entered"("paperid" integer, "classid" integer) RETURNS TABLE("pupilId" "uuid", "firstName" "text", "familyName" "text", "pMarks" integer, "qMarks" integer, "pct" integer)
    LANGUAGE "plpgsql"
    AS $$

begin
	/* return a table that shows the pupils that have submitted data for a paper */
	/* we need a second version, that accepts a class parameter and returns all pupils in that class
	 * whether they have submitted or not.
	 */
	return QUERY
	select cm."pupilId", p."firstName", p."familyName",  d."pMarks", d."qMarks", d."pct" 
	from "ClassMembership" cm
	left join (

		select "pm_userId" as "pupilId",  p."firstName", p."familyName",  sum("pm_pMarks")::int as "pMarks", sum(q_amarks)::int as "qMarks", ((sum("pm_pMarks") / sum(q_amarks)) * 100)::int as "pct"
		from vw_questions_denorm vqd 
		left join "Profile" p on vqd."pm_userId" = p.id 
		where "p_id" = paperId
		group by "pm_userId", p."firstName", p."familyName"

	) as d on cm."pupilId" = d."pupilId"
	left join "Profile" as p on cm."pupilId" = p."id"
	where cm."classId" = classId;

end;
$$;

ALTER FUNCTION "public"."fn_marks_entered"("paperid" integer, "classid" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_pupil_marks_by_available_from_date"("uuid" "uuid", "specid" integer) RETURNS TABLE("tag" "text", "title" "text", "paperid" bigint, "availablefrom" "date", "amarks" bigint, "pmarks" bigint)
    LANGUAGE "plpgsql"
    AS $$
begin
	return QUERY 
	select c.tag as "tag", c.title as "title", cp."paperId" as "paperId", 
		   cp."availableFrom"::date as "availableFrom", D."q_amarks"::bigint as "amarks", D."pm_pmarks"::bigint as "pmarks" 
	from "Classes" c
	inner join (select * from "ClassMembership" where "pupilId" = uuid ) cm ON c."id" = cm."classId"
	inner join "ClassPapers" cp on c.id= cp."classId"
	left join (
	
		select q."PaperId" as "q_paperId", sum(q."marks") as "q_amarks", sum(pm."marks") as "pm_pmarks"
		from "Questions" q
		inner join "SpecItem" as si on q."specItemId" = si."id"
		left join (
			select * 
			from "PupilMarks" 
			where "userId" = uuid
		) pm on q."id" = pm."questionId"
		where si."SpecId" = specId 
		group by q."PaperId"
		
	) as D on cp."paperId" = D."q_paperId"
	where D."pm_pmarks" is not null
	order by cp."availableFrom"; 

end;
$$;

ALTER FUNCTION "public"."fn_pupil_marks_by_available_from_date"("uuid" "uuid", "specid" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_pupil_marks_by_available_marks"("userid" "uuid", "specid" bigint) RETURNS TABLE("avMarks" bigint, "pMarks" bigint, "aMarks" bigint)
    LANGUAGE "plpgsql"
    AS $$
	BEGIN
		RETURN QUERY
			select  "q_amarks" as "avMarks", 
			 	sum("pm_pMarks")::bigint as pupilMarks, 
				sum("q_amarks")::bigint as availableMarks
		from vw_questions_denorm
		where "si_specId"=specid 
		and "pm_userId"=userid
		group by "q_amarks"
		order by "q_amarks";
	end;
$$;

ALTER FUNCTION "public"."fn_pupil_marks_by_available_marks"("userid" "uuid", "specid" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_pupil_marks_by_paper"("uuid" "uuid", "specid" integer) RETURNS TABLE("paperId" bigint, "pMarks" bigint, "aMarks" bigint)
    LANGUAGE "plpgsql"
    AS $$
	
	begin
		return QUERY
		select 	vqd."p_id" as "paperId", 
		sum(vqd."pm_pMarks")::bigint as "pMarks", 
		sum(vqd."q_amarks")::bigint as "aMarks"
		from vw_questions_denorm as vqd
		left outer join "Papers" as P on vqd."p_id" = P.id 
		where "pm_userId" = uuid
		and vqd."si_specId" = specId
		group by vqd."p_id";
		end;
$$;

ALTER FUNCTION "public"."fn_pupil_marks_by_paper"("uuid" "uuid", "specid" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_pupil_marks_by_spec_item"("userid" "uuid", "specid" bigint) RETURNS TABLE("specTag" "text", "specItem" "text", "revisionMaterials" "text", "pMarks" bigint, "aMarks" bigint)
    LANGUAGE "plpgsql"
    AS $$
	BEGIN
		RETURN QUERY
		select si.tag::text as "specTag", 
 	   si.title::text as "specItem", 
 	   si."revisionMaterials"::text as "revisionMaterials" , 
 	   coalesce (marks."pMarks", 0) as "pMarks", 
 	   coalesce (marks."aMarks", 0) as "aMarks"
from "Spec" S
left join "SpecItem" si on s."id" = si."SpecId"
left join (
select "si_tag"::text as "specTag", 
		"si_title"::text as "specItem",
		"si_revision_materials"::text as "revisionMaterials",
		sum("pm_pMarks")::bigint as "pMarks", 
		sum("q_amarks")::bigint as "aMarks"
from vw_questions_denorm
where "si_specId"=specid and "pm_userId"=userid
group by "si_tag", "si_title", "si_revision_materials"
 
) as marks on si.tag = marks."specTag"
where S.id = specid
order by si.tag;
	end;
$$;

ALTER FUNCTION "public"."fn_pupil_marks_by_spec_item"("userid" "uuid", "specid" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_pupil_marks_by_spec_item"("userid" "uuid", "specid" bigint, "classid" bigint) RETURNS TABLE("specTag" "text", "specItem" "text", "revisionMaterials" "text", "pMarks" bigint, "aMarks" bigint)
    LANGUAGE "plpgsql"
    AS $$
	BEGIN
		RETURN QUERY
		
		select si.tag::text as "specTag", 
		 	   si.title::text as "specItem", 
		 	   si."revisionMaterials"::text as "revisionMaterials" , 
		 	   coalesce (marks."pMarks", 0) as "pMarks", 
		 	   coalesce (amarks."aMarks", 0) as "aMarks"
		from "Spec" S
		left join "SpecItem" si on s."id" = si."SpecId"
		left join (
		select "si_tag"::text as "specTag", 
				"si_title"::text as "specItem",
				"si_revision_materials"::text as "revisionMaterials",
				sum("pm_pMarks")::bigint as "pMarks"
				from vw_questions_denorm
				where "si_specId"=specid and "pm_userId"= userid
				group by "si_tag", "si_title", "si_revision_materials"
		 
		) as marks on si.tag = marks."specTag"
		left join (
				select si.tag::text,  sum(q.marks)::bigint as "aMarks"
				from "ClassPapers" cp 
				left join "Questions" q on cp."paperId" = q."PaperId"  
				left join "SpecItem" as si on q."specItemId" = si."id"
				left join "Spec" s on si."SpecId" = s.id 
				where cp."classId" = classid
				group by si.tag
		) as amarks on si.tag = amarks.tag
		where S.id = specid
		order by si.tag;

	END;
$$;

ALTER FUNCTION "public"."fn_pupil_marks_by_spec_item"("userid" "uuid", "specid" bigint, "classid" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_pupil_marks_for_all_papers"("_userid" "uuid") RETURNS TABLE("userId" "uuid", "paperId" bigint, "max_marks" bigint, "marks" bigint)
    LANGUAGE "plpgsql"
    AS $$

begin
	
	return QUERY 

	select pm."userId", pm."paperId", max(p.marks)::bigInt as "max_marks",  sum(pm."marks")::bigInt as "marks"   
	from "PupilMarks" as pm 
	left join "Papers" as p on pm."paperId" = p."id" 
	where pm."userId" = _userId
	group by pm."userId", pm."paperId" 
	order by pm."userId" , pm."paperId"; 

end

$$;

ALTER FUNCTION "public"."fn_pupil_marks_for_all_papers"("_userid" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_pupilmarks_by_specitem"("userid" "uuid", "specid" bigint) RETURNS TABLE("tag" "text", "SpecItem" "text", "pupilMarks" bigint, "availableMarks" bigint)
    LANGUAGE "plpgsql"
    AS $$
	BEGIN
		select "tag", 
				"specTitle", 
				sum("pupilMarks")::bigint as pupilMarks, 
				sum("availableMarks")::bigint as availableMarks
		from vw_questions_denorm
		where "specId"=specId and "userId"=userId
		group by "tag", "specTitle"
		order by tag;
	end;
$$;

ALTER FUNCTION "public"."fn_pupilmarks_by_specitem"("userid" "uuid", "specid" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_qp_get_current_answers"("_userid" "uuid", "_path" "text") RETURNS TABLE("_created_at" timestamp with time zone, "_questionid" "text", "_iscorrect" boolean, "_max_points" integer, "_points" integer)
    LANGUAGE "plpgsql"
    AS $$
begin
	return QUERY
	select win."created_at", win."questionId", win."isCorrect", "max_points", "points" from (
	
		select  "created_at", "userId", "path", "questionId", "isCorrect", "max_points", "points" , row_number () over (
			partition by "questionId" 
			order by "created_at" desc
		) as "row_num"
		from "QPAnswer" 
		where "path" = _path

	) win
	where win."row_num"::int = 1;

end;
$$;

ALTER FUNCTION "public"."fn_qp_get_current_answers"("_userid" "uuid", "_path" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_tdf_get_queue"("pid" "uuid", "questionsetid" integer) RETURNS TABLE("questionId" bigint, "questionSetId" bigint, "specItemId" bigint, "term" "text", "def" "text", "AO" integer, "createdAt" timestamp with time zone, "pupilId" "uuid", "queueType" integer, "result" boolean, "dueDate" "date", "inQueue" integer)
    LANGUAGE "plpgsql"
    AS $$
	
	begin
		return QUERY
		
		select Q.id as "questionId", Q."questionSetId", q."specItemId" as "specItemId", q."term" as "term", q."def" as "def", q."AO" as "AO",
						queue."created_at" as "createdAt", queue."userId" as "pupilId", coalesce (queue."queueType", 0) as "queueType", queue."result" as "result", coalesce (queue."dueDate", now()::date) as "dueDate",
						case
							when queue."dueDate" is null then 0
							when date_part('day', queue."dueDate" - now()) <= 0 then 0 
							when date_part('day', queue."dueDate" - now()) > 0 and date_part('day', queue."dueDate" - now()) < 7 then 7
							else 30 END as "inQueue"
		from "TDFQuestions" as Q
		left outer join (
			select * 
			from "TDFQueue" 
			where "userId" = pId) as queue on Q."id" = queue."questionId"
		where Q."questionSetId" = questionSetId;
	
	end;
$$;

ALTER FUNCTION "public"."fn_tdf_get_queue"("pid" "uuid", "questionsetid" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_test_vars"() RETURNS TABLE("_count" integer, "_sum" integer, "_avg" real)
    LANGUAGE "plpgsql"
    AS $$
	declare 
		_count int := 10;
		_sum int := 0;
	    
	
	begin 
		
		select count(*), sum(id) from "PupilMarks" into _count, _sum;
		return QUERY
		select _count, _sum, _sum::float4 / _count::float4;
	
	end
$$;

ALTER FUNCTION "public"."fn_test_vars"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_upsert_pupilmarks"("_paperid" integer, "_questionid" integer, "_userid" "uuid", "_marks" integer) RETURNS TABLE("id" bigint, "created_at" timestamp with time zone, "userid" "uuid", "questionid" bigint, "marks" bigint, "paperid" bigint)
    LANGUAGE "plpgsql"
    AS $$
  declare

    recordId integer := null;

    lastInsertId integer := 0;

  begin

  select PM.id into recordId
  from "PupilMarks" as PM
  where PM."paperId" = _paperId
  and PM."questionId" = _questionId
  and PM."userId" = _userId;

  if recordId is null then

    begin
    /* Now record is DB, so insert a new one */

      insert into "PupilMarks" as pm
      ("userId", "questionId", "paperId", "marks")
      values (_userId, _questionId, _paperId, _marks)
      returning pm.id into lastInsertId;
      RETURN QUERY
      select * from "PupilMarks" as pm where pm.id = lastInsertId;

    end;

  else

      begin
        /* Record was found, so update */

        update "PupilMarks"
        set "marks" = _marks
        where "paperId" = _paperId
        and "questionId" = _questionId
        and "userId" = _userId;
        RETURN QUERY
        select * from "PupilMarks" as pm where pm.id = recordId;
      end;

  end if;

END;

$$;

ALTER FUNCTION "public"."fn_upsert_pupilmarks"("_paperid" integer, "_questionid" integer, "_userid" "uuid", "_marks" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_class_marks"("class_tag" "text", "paper_id" bigint) RETURNS TABLE("classid" bigint, "classtag" "text", "pupilid" "uuid", "first_name" "text", "family_name" "text", "marks" integer)
    LANGUAGE "plpgsql"
    AS $$
declare classIdFromTable integer;
begin

	
classIdFromTable = (select id from "Classes" where tag = class_tag);

return query
select c.id, c.tag, p.id, p."firstName", p."familyName", marks.marks
from "ClassMembership" cm
left join "Profile" p on cm."pupilId" = p.id
left join "Classes" c on cm."classId" = c.id
left join (

	select p.id, sum(pm.marks)::int as marks
	from "PupilMarks" pm
	left join "Profile" p on pm."userId" = p.id
	where pm."paperId" = paper_id and pm."userId" in (
	  select id
	  from "Profile" p
	  left join "ClassMembership" cm on p."id" = cm."pupilId"
	  where cm."classId" = classIdFromTable
	)
	group by p.id

) as marks on p.id = marks.id
where cm."classId" = classIdFromTable;
end;
$$;

ALTER FUNCTION "public"."get_class_marks"("class_tag" "text", "paper_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_papers_class_tag"("class_tag" "text") RETURNS TABLE("classId" bigint, "paperId" bigint, "year" "text", "month" "text", "title" "text", "paper" "text")
    LANGUAGE "plpgsql"
    AS $$
begin
return query
select c.id as "classId", p.id as  "paperId", p.year::text, p.month::text, p.title::text, p.paper::text  
from "ClassPapers" cp 
left join "Classes" c on cp."classId" = c.id 
left join "Papers" p on cp."paperId" = p.id 
where c.tag=class_tag;
end;
$$;

ALTER FUNCTION "public"."get_papers_class_tag"("class_tag" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."helloworld"("_name" "text") RETURNS TABLE("msg" "text")
    LANGUAGE "plpgsql"
    AS $$
declare 
	msg text; 

begin 
	
	select 'Hello' || ' ' || "_name" into msg; 

	raise info 'Hello World %',  msg;

	return query
	select msg;
	
end $$;

ALTER FUNCTION "public"."helloworld"("_name" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "dailyquestion"."question" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "specItemId" bigint,
    "questionTypeId" bigint DEFAULT '1'::bigint,
    "questionData" "json",
    "createdBy" character varying,
    "likes" character varying[] DEFAULT '{}'::character varying[],
    "dislikes" character varying DEFAULT '{}'::character varying
);

ALTER TABLE "dailyquestion"."question" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "dailyquestion"."questionType" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text"
);

ALTER TABLE "dailyquestion"."questionType" OWNER TO "postgres";

ALTER TABLE "dailyquestion"."questionType" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "dailyquestion"."questionType_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "dailyquestion"."salaries" (
    "id" bigint NOT NULL,
    "salary" bigint NOT NULL
);

ALTER TABLE "dailyquestion"."salaries" OWNER TO "postgres";

ALTER TABLE "dailyquestion"."salaries" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "dailyquestion"."salaries_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."ClassMembership" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "classId" bigint NOT NULL,
    "pupilId" "uuid" NOT NULL
);

ALTER TABLE "public"."ClassMembership" OWNER TO "postgres";

COMMENT ON TABLE "public"."ClassMembership" IS 'Joinign a Pupil with Classes';

CREATE TABLE IF NOT EXISTS "public"."TBD-ClassPaperResources" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "classId" bigint,
    "paperId" bigint,
    "url" "text",
    "label" "text"
);

ALTER TABLE "public"."TBD-ClassPaperResources" OWNER TO "postgres";

ALTER TABLE "public"."TBD-ClassPaperResources" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."ClassPaperResources_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."ClassPapers" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "classId" bigint NOT NULL,
    "paperId" bigint NOT NULL,
    "completeBy" timestamp with time zone DEFAULT "now"(),
    "markBy" timestamp with time zone DEFAULT "now"(),
    "availableFrom" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."ClassPapers" OWNER TO "postgres";

COMMENT ON TABLE "public"."ClassPapers" IS 'Links Classes to Papers';

CREATE TABLE IF NOT EXISTS "public"."Classes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "tag" "text" NOT NULL,
    "title" "text" NOT NULL,
    "join_code" "text" NOT NULL,
    "specId" bigint NOT NULL
);

ALTER TABLE "public"."Classes" OWNER TO "postgres";

ALTER TABLE "public"."Classes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Classes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."FCQuestions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "term" "text" NOT NULL,
    "text" "text" NOT NULL,
    "specItemId" bigint NOT NULL
);

ALTER TABLE "public"."FCQuestions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."FCUSerQueueEntries" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "userId" "uuid" NOT NULL,
    "specItemId" bigint NOT NULL,
    "dueDate" timestamp with time zone NOT NULL,
    "currentQueue" integer NOT NULL,
    "questionId" "uuid" NOT NULL
);

ALTER TABLE "public"."FCUSerQueueEntries" OWNER TO "postgres";

ALTER TABLE "public"."FCUSerQueueEntries" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."FCUSerQueueEntries_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."FCUserQuestionHistory" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "userid" "uuid" NOT NULL,
    "specItemId" bigint NOT NULL,
    "questionId" "uuid" NOT NULL,
    "answer" "text" NOT NULL,
    "result" boolean NOT NULL
);

ALTER TABLE "public"."FCUserQuestionHistory" OWNER TO "postgres";

ALTER TABLE "public"."FCUserQuestionHistory" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."FCUserQuestionHistory_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."FCUserQueues" (
    "userid" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "specItemId" bigint NOT NULL
);

ALTER TABLE "public"."FCUserQueues" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Papers" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "year" character varying,
    "title" character varying,
    "subject" character varying,
    "paper" character varying,
    "marks" bigint,
    "specId" bigint,
    "month" "text",
    "qPaperLabel" "text",
    "aPaperLabel" "text"
);

ALTER TABLE "public"."Papers" OWNER TO "postgres";

ALTER TABLE "public"."Papers" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Papers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."Profile" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "isAdmin" boolean DEFAULT false NOT NULL,
    "classes" "text"[] DEFAULT '{}'::"text"[],
    "firstName" "text" NOT NULL,
    "familyName" "text" NOT NULL,
    "id" "uuid" NOT NULL,
    "isTech" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."Profile" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."PupilMarks" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "userId" "uuid" NOT NULL,
    "questionId" bigint NOT NULL,
    "marks" bigint,
    "paperId" bigint NOT NULL
);

ALTER TABLE "public"."PupilMarks" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."PupilMarks_2024_03_29" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "userId" "uuid" NOT NULL,
    "questionId" bigint NOT NULL,
    "marks" bigint,
    "paperId" bigint NOT NULL
);

ALTER TABLE "public"."PupilMarks_2024_03_29" OWNER TO "postgres";

COMMENT ON TABLE "public"."PupilMarks_2024_03_29" IS 'This is a duplicate of PupilMarks';

ALTER TABLE "public"."PupilMarks_2024_03_29" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."PupilMarks_duplicate_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."QPAnswer" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "userId" "uuid" NOT NULL,
    "questionId" "text" NOT NULL,
    "isCorrect" boolean NOT NULL,
    "answer" "text" NOT NULL,
    "path" "text" NOT NULL,
    "max_points" integer DEFAULT 0 NOT NULL,
    "points" integer DEFAULT 0 NOT NULL
);

ALTER TABLE "public"."QPAnswer" OWNER TO "postgres";

ALTER TABLE "public"."QPAnswer" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."QPAnswer_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."Questions" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "PaperId" bigint,
    "question_number" "text",
    "marks" bigint,
    "specItemId" bigint,
    "question_order" integer DEFAULT 0
);

ALTER TABLE "public"."Questions" OWNER TO "postgres";

ALTER TABLE "public"."Questions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Questions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."Spec" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "title" character varying,
    "subject" character varying
);

ALTER TABLE "public"."Spec" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."SpecItem" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "SpecId" bigint,
    "tag" character varying,
    "title" character varying,
    "revisionMaterials" "text",
    "specUnitId" bigint
);

ALTER TABLE "public"."SpecItem" OWNER TO "postgres";

ALTER TABLE "public"."SpecItem" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."SpecItem_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."SpecUnits" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "specId" bigint NOT NULL
);

ALTER TABLE "public"."SpecUnits" OWNER TO "postgres";

ALTER TABLE "public"."SpecUnits" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."SpecUnits_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."Spec" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Spec_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."Tasks" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "classId" bigint,
    "paperId" bigint,
    "isActive" boolean DEFAULT false
);

ALTER TABLE "public"."Tasks" OWNER TO "postgres";

ALTER TABLE "public"."Tasks" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Tasks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."PupilMarks" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."UserMarks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."WorkQueue" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "userid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "publicUrl" "text" NOT NULL,
    "filePath" "text" DEFAULT '""'::"text" NOT NULL,
    "machine" "text" DEFAULT '""'::"text" NOT NULL,
    "notes" "text" DEFAULT '""'::"text" NOT NULL,
    "status" "text" DEFAULT 'waiting'::"text" NOT NULL,
    "complete_date" timestamp without time zone,
    "tech_notes" "text"
);

ALTER TABLE "public"."WorkQueue" OWNER TO "postgres";

ALTER TABLE "public"."WorkQueue" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."WorkQueue_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."WorkUploads" (
    "id" bigint NOT NULL,
    "owner" "uuid" NOT NULL,
    "paperId" "text" NOT NULL,
    "dt" "date" NOT NULL,
    "path" "text" NOT NULL,
    "fileName" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."WorkUploads" OWNER TO "postgres";

ALTER TABLE "public"."WorkUploads" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."WorkUploads_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."__specid" (
    "specId" bigint
);

ALTER TABLE "public"."__specid" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."cat_names" (
    "cat_name" "text"
);

ALTER TABLE "public"."cat_names" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."dqAnswers" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "owner" "text" NOT NULL,
    "questionId" bigint NOT NULL,
    "answer" "json",
    "isCorrect" boolean,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "attempts" bigint DEFAULT '0'::bigint NOT NULL,
    "correct" bigint DEFAULT '0'::bigint NOT NULL,
    "likeState" smallint DEFAULT '0'::smallint NOT NULL,
    "flag" boolean
);

ALTER TABLE "public"."dqAnswers" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."dqPage" (
    "id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "summary" "text" NOT NULL,
    "specItemId" bigint NOT NULL,
    "transcript" "text" NOT NULL,
    "title" "text" DEFAULT ' '::"text" NOT NULL
);

ALTER TABLE "public"."dqPage" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."dqQuestionType" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text"
);

ALTER TABLE "public"."dqQuestionType" OWNER TO "postgres";

ALTER TABLE "public"."dqQuestionType" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."dqQuestionType_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."dqQuestions" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "question_text" "text" NOT NULL,
    "choices" "text"[] NOT NULL,
    "correct_answer" "text" NOT NULL,
    "specItemId" bigint,
    "createdBy" "uuid",
    "code" "text"
);

ALTER TABLE "public"."dqQuestions" OWNER TO "postgres";

ALTER TABLE "public"."dqQuestions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."dqQuestions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE OR REPLACE VIEW "public"."dq_vw_answers" AS
 SELECT "da"."created_at",
    "da"."owner",
    "da"."questionId",
    "da"."answer",
    "da"."isCorrect",
    "da"."id",
    "da"."attempts",
    "da"."correct",
    "da"."likeState",
    "da"."flag",
    "dq"."code"
   FROM ("public"."dqAnswers" "da"
     LEFT JOIN "public"."dqQuestions" "dq" ON (("da"."questionId" = "dq"."id")));

ALTER TABLE "public"."dq_vw_answers" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."result_record" (
    "id" bigint,
    "created_at" timestamp with time zone,
    "createdBy" "text",
    "specItemId" bigint,
    "questionData" "json",
    "questionType" bigint,
    "correctAnswer" "json",
    "tag" character varying,
    "title" character varying,
    "specTitle" character varying
);

ALTER TABLE "public"."result_record" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."test" (
    "id" integer,
    "category" "text",
    "value" integer
);

ALTER TABLE "public"."test" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_class_lists" AS
 SELECT "c"."tag",
    "cm"."pupilId",
    "p"."firstName",
    "p"."familyName"
   FROM (("public"."ClassMembership" "cm"
     LEFT JOIN "public"."Profile" "p" ON (("cm"."pupilId" = "p"."id")))
     LEFT JOIN "public"."Classes" "c" ON (("cm"."classId" = "c"."id")))
  ORDER BY "c"."tag", "p"."firstName", "p"."familyName";

ALTER TABLE "public"."vw_class_lists" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_dq_answers_denormed" AS
 SELECT ("da"."created_at")::"date" AS "created_at",
    "p"."id" AS "owner",
    "p"."firstName",
    "p"."familyName",
    "q"."id" AS "questionId",
    "q"."code" AS "questionCode",
    "si"."id" AS "specItemId",
    "si"."tag" AS "specItemTag",
    "si"."title" AS "specItemTitle",
    "su"."id" AS "specUnitId",
    "su"."title" AS "specUnitTitle",
    "s"."id" AS "specId",
    "s"."title" AS "specTitle",
    "s"."subject" AS "specSubject",
    "da"."id" AS "answerId",
    "da"."isCorrect",
    "da"."created_at" AS "answerCreatedAt",
    "da"."questionId" AS "answerQuestionId"
   FROM ((((("public"."dqAnswers" "da"
     LEFT JOIN "public"."dqQuestions" "q" ON (("da"."questionId" = "q"."id")))
     LEFT JOIN "public"."SpecItem" "si" ON (("q"."specItemId" = "si"."id")))
     LEFT JOIN "public"."SpecUnits" "su" ON (("si"."specUnitId" = "su"."id")))
     LEFT JOIN "public"."Spec" "s" ON (("su"."specId" = "s"."id")))
     LEFT JOIN "public"."Profile" "p" ON (("da"."owner" = ("p"."id")::"text")))
  ORDER BY (("da"."created_at")::"date") DESC, "p"."familyName";

ALTER TABLE "public"."vw_dq_answers_denormed" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_dq_daily_pupil_answer_count" AS
 SELECT ("da"."created_at")::"date" AS "created_at",
    "da"."owner",
    "c"."tag" AS "classTag",
    "p"."firstName",
    "p"."familyName",
    "si"."id" AS "specItemId",
    "si"."tag",
    "si"."title",
    "count"(*) AS "count"
   FROM ((((("public"."dqAnswers" "da"
     LEFT JOIN "public"."Profile" "p" ON (("da"."owner" = ("p"."id")::"text")))
     LEFT JOIN "public"."ClassMembership" "cm" ON (("p"."id" = "cm"."pupilId")))
     LEFT JOIN "public"."dqQuestions" "dq" ON (("da"."questionId" = "dq"."id")))
     LEFT JOIN "public"."SpecItem" "si" ON (("dq"."specItemId" = "si"."id")))
     LEFT JOIN "public"."Classes" "c" ON ((("cm"."classId" = "c"."id") AND ("c"."specId" = "si"."SpecId"))))
  WHERE (("da"."isCorrect" = true) AND ("c"."tag" IS NOT NULL))
  GROUP BY (("da"."created_at")::"date"), "da"."owner", "c"."tag", "p"."firstName", "p"."familyName", "si"."id", "si"."tag", "si"."title", "dq"."specItemId"
  ORDER BY (("da"."created_at")::"date") DESC;

ALTER TABLE "public"."vw_dq_daily_pupil_answer_count" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_dq_pupil_scores_last5days" AS
 SELECT "last5days"."cl_classTag",
    "last5days"."pupilId",
    "last5days"."firstName",
    "last5days"."familyName",
    "last5days"."dt",
    "pupil_scores"."count"
   FROM (( SELECT "class_list"."cl_classTag",
            "class_list"."pupilId",
            "class_list"."firstName",
            "class_list"."familyName",
            "date_range"."dt"
           FROM ( SELECT "c"."tag" AS "cl_classTag",
                    "cm"."pupilId",
                    "p"."firstName",
                    "p"."familyName"
                   FROM (("public"."ClassMembership" "cm"
                     LEFT JOIN "public"."Classes" "c" ON (("cm"."classId" = "c"."id")))
                     LEFT JOIN "public"."Profile" "p" ON (("cm"."pupilId" = "p"."id")))) "class_list",
            ( SELECT ("date_trunc"('day'::"text", "dd"."dd"))::"date" AS "dt"
                   FROM "generate_series"(((CURRENT_DATE - 5))::timestamp with time zone, ((CURRENT_DATE - 1))::timestamp with time zone, '1 day'::interval) "dd"("dd")) "date_range") "last5days"
     LEFT JOIN ( SELECT "vw_dq_daily_pupil_answer_count"."created_at",
            "vw_dq_daily_pupil_answer_count"."classTag",
            "vw_dq_daily_pupil_answer_count"."owner",
            "vw_dq_daily_pupil_answer_count"."firstName",
            "vw_dq_daily_pupil_answer_count"."familyName",
            "sum"("vw_dq_daily_pupil_answer_count"."count") AS "count"
           FROM "public"."vw_dq_daily_pupil_answer_count"
          GROUP BY "vw_dq_daily_pupil_answer_count"."created_at", "vw_dq_daily_pupil_answer_count"."classTag", "vw_dq_daily_pupil_answer_count"."owner", "vw_dq_daily_pupil_answer_count"."firstName", "vw_dq_daily_pupil_answer_count"."familyName") "pupil_scores" ON ((("last5days"."dt" = "pupil_scores"."created_at") AND ("last5days"."cl_classTag" = "pupil_scores"."classTag") AND (("last5days"."pupilId")::"text" = "pupil_scores"."owner"))))
  ORDER BY "last5days"."cl_classTag";

ALTER TABLE "public"."vw_dq_pupil_scores_last5days" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_duplicate_pupil_marks" AS
 SELECT "pm"."userId",
    "p"."firstName",
    "pm"."paperId",
    "pm"."questionId",
    "count"(*) AS "count"
   FROM (("public"."PupilMarks" "pm"
     LEFT JOIN "public"."Profile" "p" ON (("pm"."userId" = "p"."id")))
     LEFT JOIN "public"."Questions" "q" ON (("pm"."questionId" = "q"."id")))
  GROUP BY "pm"."userId", "p"."firstName", "pm"."paperId", "pm"."questionId"
 HAVING ("count"(*) > 1)
  ORDER BY ("count"(*)) DESC;

ALTER TABLE "public"."vw_duplicate_pupil_marks" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_marks_for_papers_by_tag" AS
SELECT
    NULL::"uuid" AS "pupilId",
    NULL::bigint AS "paperId",
    NULL::"text" AS "tag",
    NULL::"text" AS "firstName",
    NULL::"text" AS "familyName",
    NULL::"uuid" AS "userId",
    NULL::numeric AS "sum";

ALTER TABLE "public"."vw_marks_for_papers_by_tag" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_paper_marks_for_pupil_detail" AS
 SELECT "si"."id",
    "si"."SpecId",
    "si"."tag",
    "si"."title",
    "pupilmarks"."paperId",
    "pupilmarks"."userId",
    "pupilmarks"."aMarks",
    "pupilmarks"."qMarks"
   FROM ("public"."SpecItem" "si"
     LEFT JOIN ( SELECT "si_1"."SpecId",
            "si_1"."tag",
            "pm"."marks" AS "aMarks",
            "q"."marks" AS "qMarks",
            "pm"."userId",
            "p"."id" AS "paperId",
            "p"."year",
            "p"."month",
            "p"."paper"
           FROM ((("public"."PupilMarks" "pm"
             LEFT JOIN "public"."Questions" "q" ON (("pm"."questionId" = "q"."id")))
             LEFT JOIN "public"."SpecItem" "si_1" ON (("q"."specItemId" = "si_1"."id")))
             LEFT JOIN "public"."Papers" "p" ON (("pm"."paperId" = "p"."id")))) "pupilmarks" ON ((("si"."SpecId" = "pupilmarks"."SpecId") AND (("si"."tag")::"text" = ("pupilmarks"."tag")::"text"))))
  ORDER BY "si"."SpecId", "si"."tag", "pupilmarks"."paperId";

ALTER TABLE "public"."vw_paper_marks_for_pupil_detail" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_papers_for_classes" AS
 SELECT "c"."id" AS "classId",
    "c"."tag",
    "c"."specId",
    "p"."year",
    "p"."month",
    "p"."paper",
    "p"."title",
    "p"."id" AS "paperId",
    "cp"."availableFrom",
    "cp"."completeBy",
    "cp"."markBy"
   FROM (("public"."Classes" "c"
     LEFT JOIN "public"."Papers" "p" ON (("c"."specId" = "p"."specId")))
     LEFT JOIN "public"."ClassPapers" "cp" ON ((("p"."id" = "cp"."paperId") AND ("c"."id" = "cp"."classId"))));

ALTER TABLE "public"."vw_papers_for_classes" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_pupil_marks_denormed" AS
 SELECT "pm"."id" AS "pupilMarksId",
    "s"."id" AS "specId",
    "cm"."pupilId",
    "p"."firstName",
    "p"."familyName",
    "c2"."id" AS "classId",
    "c2"."tag" AS "classTag",
    "c2"."title" AS "classTitle",
    "pa"."id" AS "paperId",
    "pa"."year",
    "pa"."month",
    "pa"."paper",
    "cp"."availableFrom",
    "cp"."completeBy",
    "cp"."markBy",
    "s"."title" AS "specTitle",
    "s"."subject" AS "specSubject",
    "su"."id" AS "specUnitId",
    "su"."title" AS "specUnitTitle",
    "si"."id" AS "specItemId",
    "si"."tag" AS "specItemTag",
    "si"."title" AS "specItemTitle",
    "q"."id" AS "questionId",
    "q"."question_number" AS "questionNumber",
    "q"."question_order" AS "questionOrder",
    "q"."marks" AS "questionMarks",
    "pm"."marks" AS "answerMarks"
   FROM ((((((((("public"."PupilMarks" "pm"
     LEFT JOIN "public"."Questions" "q" ON (("pm"."questionId" = "q"."id")))
     LEFT JOIN "public"."SpecItem" "si" ON (("q"."specItemId" = "si"."id")))
     LEFT JOIN "public"."SpecUnits" "su" ON (("si"."specUnitId" = "su"."id")))
     LEFT JOIN "public"."Spec" "s" ON (("su"."specId" = "s"."id")))
     LEFT JOIN "public"."Papers" "pa" ON (("q"."PaperId" = "pa"."id")))
     LEFT JOIN "public"."Profile" "p" ON (("pm"."userId" = "p"."id")))
     LEFT JOIN "public"."ClassMembership" "cm" ON ((("p"."id" = "cm"."pupilId") AND ("cm"."classId" IN ( SELECT "c1"."id"
           FROM "public"."Classes" "c1"
          WHERE ("c1"."specId" = "s"."id"))))))
     LEFT JOIN "public"."Classes" "c2" ON (("cm"."classId" = "c2"."id")))
     LEFT JOIN "public"."ClassPapers" "cp" ON ((("c2"."id" = "cp"."classId") AND ("cp"."paperId" = "pa"."id"))))
  ORDER BY "c2"."tag";

ALTER TABLE "public"."vw_pupil_marks_denormed" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_pupil_marks_for_spec" AS
 SELECT "pm"."userId",
    "si"."SpecId",
    "si"."tag",
    "si"."title",
    ("sum"("q"."marks"))::integer AS "q_marks",
    ("sum"("pm"."marks"))::integer AS "pm_marks",
    (("sum"("pm"."marks") / "sum"("q"."marks")))::double precision AS "avg"
   FROM ((("public"."PupilMarks" "pm"
     LEFT JOIN "public"."Questions" "q" ON (("q"."id" = "pm"."questionId")))
     LEFT JOIN "public"."Profile" "p" ON (("pm"."userId" = "p"."id")))
     LEFT JOIN "public"."SpecItem" "si" ON (("q"."specItemId" = "si"."id")))
  GROUP BY "pm"."userId", "si"."SpecId", "si"."tag", "si"."title"
  ORDER BY "si"."tag";

ALTER TABLE "public"."vw_pupil_marks_for_spec" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_questions_denorm" AS
 SELECT "pm"."id" AS "pm_id",
    "pm"."created_at" AS "pm_entered",
    "pm"."marks" AS "pm_pMarks",
    "pm"."userId" AS "pm_userId",
    "q"."id" AS "q_id",
    "q"."marks" AS "q_amarks",
    "q"."question_number" AS "q_qnumber",
    "q"."question_order" AS "q_qorder",
    "p"."id" AS "p_id",
    "p"."year" AS "p_year",
    "p"."month" AS "q_month",
    "p"."paper" AS "p_paper",
    "p"."title" AS "p_title",
    "p"."subject" AS "p_subject",
    "si"."tag" AS "si_tag",
    "si"."title" AS "si_title",
    "si"."revisionMaterials" AS "si_revision_materials",
    "si"."SpecId" AS "si_specId"
   FROM ((("public"."PupilMarks" "pm"
     LEFT JOIN "public"."Questions" "q" ON (("pm"."questionId" = "q"."id")))
     LEFT JOIN "public"."Papers" "p" ON (("q"."PaperId" = "p"."id")))
     LEFT JOIN "public"."SpecItem" "si" ON (("q"."specItemId" = "si"."id")));

ALTER TABLE "public"."vw_questions_denorm" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_user_marks_for_paper" AS
 SELECT "um"."userId",
    "p"."title",
    "q"."question_number",
    "q"."marks" AS "qMarks",
    COALESCE("um"."marks", (0)::bigint) AS "uMarks",
    "si"."tag",
    "s"."title" AS "Spec Title"
   FROM (((("public"."Questions" "q"
     JOIN "public"."Papers" "p" ON (("q"."PaperId" = "p"."id")))
     JOIN "public"."SpecItem" "si" ON (("q"."specItemId" = "si"."id")))
     JOIN "public"."Spec" "s" ON (("si"."SpecId" = "s"."id")))
     LEFT JOIN "public"."PupilMarks" "um" ON (("q"."id" = "um"."questionId")));

ALTER TABLE "public"."vw_user_marks_for_paper" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_user_marks_for_paper_clone" AS
 SELECT 1 AS "?column?";

ALTER TABLE "public"."vw_user_marks_for_paper_clone" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_user_marks_for_spec" AS
 SELECT "si"."tag",
    "si"."title",
    ("sum"("q"."marks"))::integer AS "q_marks",
    ("sum"("pm"."marks"))::integer AS "pm_marks",
    (("sum"("pm"."marks") / "sum"("q"."marks")))::double precision AS "avg"
   FROM ((("public"."PupilMarks" "pm"
     LEFT JOIN "public"."Questions" "q" ON (("q"."id" = "pm"."questionId")))
     LEFT JOIN "public"."Profile" "p" ON (("pm"."userId" = "p"."id")))
     LEFT JOIN "public"."SpecItem" "si" ON (("q"."specItemId" = "si"."id")))
  GROUP BY "si"."tag", "si"."title"
  ORDER BY "si"."tag";

ALTER TABLE "public"."vw_user_marks_for_spec" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."vw_wq_tickets" AS
 SELECT "wq"."id",
    "wq"."created_at",
    "wq"."userid",
    "wq"."publicUrl",
    "wq"."filePath",
    "wq"."machine",
    "wq"."notes",
    "wq"."tech_notes",
    "wq"."status",
    "wq"."complete_date",
    "p"."firstName",
    "p"."familyName",
    "p"."isAdmin",
    "p"."isTech"
   FROM ("public"."WorkQueue" "wq"
     LEFT JOIN "public"."Profile" "p" ON (("wq"."userid" = "p"."id")))
  ORDER BY "wq"."created_at";

ALTER TABLE "public"."vw_wq_tickets" OWNER TO "postgres";

ALTER TABLE ONLY "dailyquestion"."questionType"
    ADD CONSTRAINT "questionType_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "dailyquestion"."question"
    ADD CONSTRAINT "question_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "dailyquestion"."salaries"
    ADD CONSTRAINT "salaries_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."ClassMembership"
    ADD CONSTRAINT "ClassMembership_pkey" PRIMARY KEY ("classId", "pupilId");

ALTER TABLE ONLY "public"."TBD-ClassPaperResources"
    ADD CONSTRAINT "ClassPaperResources_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."ClassPapers"
    ADD CONSTRAINT "ClassPapers_pkey" PRIMARY KEY ("classId", "paperId");

ALTER TABLE ONLY "public"."Classes"
    ADD CONSTRAINT "Classes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."FCQuestions"
    ADD CONSTRAINT "FCQuestions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."FCUSerQueueEntries"
    ADD CONSTRAINT "FCUSerQueueEntries_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."FCUserQuestionHistory"
    ADD CONSTRAINT "FCUserQuestionHistory_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."FCUserQueues"
    ADD CONSTRAINT "FCUserQueues_pkey" PRIMARY KEY ("userid", "specItemId");

ALTER TABLE ONLY "public"."Papers"
    ADD CONSTRAINT "Papers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Profile"
    ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."PupilMarks_2024_03_29"
    ADD CONSTRAINT "PupilMarks_duplicate_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."PupilMarks"
    ADD CONSTRAINT "PupilMarks_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."QPAnswer"
    ADD CONSTRAINT "QPAnswer_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Questions"
    ADD CONSTRAINT "Questions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."SpecItem"
    ADD CONSTRAINT "SpecItem_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."SpecUnits"
    ADD CONSTRAINT "SpecUnits_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Spec"
    ADD CONSTRAINT "Spec_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Tasks"
    ADD CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."WorkQueue"
    ADD CONSTRAINT "WorkQueue_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."WorkUploads"
    ADD CONSTRAINT "WorkUploads_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."dqAnswers"
    ADD CONSTRAINT "dqAnswers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."dqPage"
    ADD CONSTRAINT "dqPage_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."dqQuestionType"
    ADD CONSTRAINT "dqQuestionType_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."dqQuestions"
    ADD CONSTRAINT "dqQuestions_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE VIEW "public"."vw_marks_for_papers_by_tag" AS
 SELECT "p"."id" AS "pupilId",
    "pm"."paperId",
    "c"."tag",
    "p"."firstName",
    "p"."familyName",
    "pm"."userId",
    "sum"("pm"."marks") AS "sum"
   FROM ((("public"."PupilMarks" "pm"
     LEFT JOIN "public"."Profile" "p" ON (("pm"."userId" = "p"."id")))
     LEFT JOIN "public"."ClassMembership" "cm" ON (("p"."id" = "cm"."pupilId")))
     LEFT JOIN "public"."Classes" "c" ON (("cm"."classId" = "c"."id")))
  GROUP BY "p"."id", "pm"."paperId", "c"."tag", "p"."firstName", "pm"."userId"
  ORDER BY "p"."firstName", "pm"."paperId", "pm"."userId";

ALTER TABLE ONLY "dailyquestion"."question"
    ADD CONSTRAINT "question_questionTypeId_fkey" FOREIGN KEY ("questionTypeId") REFERENCES "dailyquestion"."questionType"("id");

ALTER TABLE ONLY "dailyquestion"."question"
    ADD CONSTRAINT "question_specItemId_fkey" FOREIGN KEY ("specItemId") REFERENCES "public"."SpecItem"("id");

ALTER TABLE ONLY "public"."ClassMembership"
    ADD CONSTRAINT "ClassMembership_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Classes"("id");

ALTER TABLE ONLY "public"."ClassMembership"
    ADD CONSTRAINT "ClassMembership_pupilId_fkey" FOREIGN KEY ("pupilId") REFERENCES "public"."Profile"("id");

ALTER TABLE ONLY "public"."Classes"
    ADD CONSTRAINT "Classes_specId_fkey" FOREIGN KEY ("specId") REFERENCES "public"."Spec"("id");

ALTER TABLE ONLY "public"."FCQuestions"
    ADD CONSTRAINT "FCQuestions_specItemId_fkey" FOREIGN KEY ("specItemId") REFERENCES "public"."SpecItem"("id");

ALTER TABLE ONLY "public"."FCUSerQueueEntries"
    ADD CONSTRAINT "FCUSerQueueEntries_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."FCQuestions"("id");

ALTER TABLE ONLY "public"."FCUSerQueueEntries"
    ADD CONSTRAINT "FCUSerQueueEntries_specItemId_fkey" FOREIGN KEY ("specItemId") REFERENCES "public"."SpecItem"("id");

ALTER TABLE ONLY "public"."FCUSerQueueEntries"
    ADD CONSTRAINT "FCUSerQueueEntries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Profile"("id");

ALTER TABLE ONLY "public"."FCUserQuestionHistory"
    ADD CONSTRAINT "FCUserQuestionHistory_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."FCQuestions"("id");

ALTER TABLE ONLY "public"."FCUserQuestionHistory"
    ADD CONSTRAINT "FCUserQuestionHistory_specItemId_fkey" FOREIGN KEY ("specItemId") REFERENCES "public"."SpecItem"("id");

ALTER TABLE ONLY "public"."FCUserQueues"
    ADD CONSTRAINT "FCUserQueues_specItemId_fkey" FOREIGN KEY ("specItemId") REFERENCES "public"."SpecItem"("id");

ALTER TABLE ONLY "public"."Papers"
    ADD CONSTRAINT "Papers_specId_fkey" FOREIGN KEY ("specId") REFERENCES "public"."Spec"("id");

ALTER TABLE ONLY "public"."Profile"
    ADD CONSTRAINT "Profile_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."PupilMarks"
    ADD CONSTRAINT "PupilMarks_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Papers"("id");

ALTER TABLE ONLY "public"."PupilMarks"
    ADD CONSTRAINT "PupilMarks_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Questions"("id");

ALTER TABLE ONLY "public"."QPAnswer"
    ADD CONSTRAINT "QPAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Profile"("id");

ALTER TABLE ONLY "public"."Questions"
    ADD CONSTRAINT "Questions_PaperId_fkey" FOREIGN KEY ("PaperId") REFERENCES "public"."Papers"("id");

ALTER TABLE ONLY "public"."Questions"
    ADD CONSTRAINT "Questions_specItemId_fkey" FOREIGN KEY ("specItemId") REFERENCES "public"."SpecItem"("id");

ALTER TABLE ONLY "public"."SpecItem"
    ADD CONSTRAINT "SpecItem_SpecId_fkey" FOREIGN KEY ("SpecId") REFERENCES "public"."Spec"("id");

ALTER TABLE ONLY "public"."TBD-ClassPaperResources"
    ADD CONSTRAINT "TBD-ClassPaperResources_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Classes"("id");

ALTER TABLE ONLY "public"."TBD-ClassPaperResources"
    ADD CONSTRAINT "TBD-ClassPaperResources_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Papers"("id");

ALTER TABLE ONLY "public"."Tasks"
    ADD CONSTRAINT "Tasks_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Classes"("id");

ALTER TABLE ONLY "public"."Tasks"
    ADD CONSTRAINT "Tasks_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Papers"("id");

ALTER TABLE ONLY "public"."ClassPapers"
    ADD CONSTRAINT "public_ClassPapers_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Classes"("id");

ALTER TABLE ONLY "public"."ClassPapers"
    ADD CONSTRAINT "public_ClassPapers_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Papers"("id");

ALTER TABLE ONLY "public"."PupilMarks_2024_03_29"
    ADD CONSTRAINT "public_PupilMarks_duplicate_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Papers"("id");

ALTER TABLE ONLY "public"."PupilMarks_2024_03_29"
    ADD CONSTRAINT "public_PupilMarks_duplicate_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Questions"("id");

ALTER TABLE ONLY "public"."SpecItem"
    ADD CONSTRAINT "public_SpecItem_specUnitId_fkey" FOREIGN KEY ("specUnitId") REFERENCES "public"."SpecUnits"("id");

ALTER TABLE ONLY "public"."SpecUnits"
    ADD CONSTRAINT "public_SpecUnits_specId_fkey" FOREIGN KEY ("specId") REFERENCES "public"."Spec"("id");

ALTER TABLE ONLY "public"."WorkUploads"
    ADD CONSTRAINT "public_WorkUploads_owner_fkey" FOREIGN KEY ("owner") REFERENCES "public"."Profile"("id");

ALTER TABLE ONLY "public"."dqAnswers"
    ADD CONSTRAINT "public_dqAnswers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."dqQuestions"("id");

ALTER TABLE ONLY "public"."dqPage"
    ADD CONSTRAINT "public_dqPage_specItemId_fkey" FOREIGN KEY ("specItemId") REFERENCES "public"."SpecItem"("id");

ALTER TABLE ONLY "public"."dqQuestions"
    ADD CONSTRAINT "public_dqQuestions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."Profile"("id");

ALTER TABLE ONLY "public"."dqQuestions"
    ADD CONSTRAINT "public_dqQuestions_specItemId_fkey" FOREIGN KEY ("specItemId") REFERENCES "public"."SpecItem"("id");

CREATE POLICY "Enable insert for authenticated users only" ON "dailyquestion"."question" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "dailyquestion"."question" FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users only" ON "dailyquestion"."question" FOR UPDATE TO "authenticated" WITH CHECK (true);

ALTER TABLE "dailyquestion"."question" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "dailyquestion"."questionType" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."ClassMembership" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."ClassPapers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Classes" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL for authenticated users only" ON "public"."dqAnswers" TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users only" ON "public"."WorkQueue" TO "authenticated" USING (true);

CREATE POLICY "Enable all for authenticated users only" ON "public"."WorkUploads" TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users only" ON "public"."dqQuestions" TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON "public"."Questions" FOR DELETE TO "authenticated" USING (true);

CREATE POLICY "Enable insert access for all users" ON "public"."FCUserQuestionHistory" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for all users" ON "public"."PupilMarks" FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."ClassMembership" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."ClassPapers" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."FCUSerQueueEntries" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."Papers" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."Profile" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."QPAnswer" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."Questions" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."TBD-ClassPaperResources" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."WorkQueue" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."dqPage" TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."dqQuestionType" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable read access for all authenticated users" ON "public"."Papers" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."ClassMembership" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."ClassPapers" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."Classes" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."FCQuestions" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."FCUserQueues" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."Profile" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."PupilMarks" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."Questions" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."Spec" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."SpecItem" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."SpecUnits" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."TBD-ClassPaperResources" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."dqAnswers" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."dqQuestionType" FOR SELECT USING (true);

CREATE POLICY "Enable read for authenticated users only" ON "public"."FCUSerQueueEntries" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."FCUserQuestionHistory" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."QPAnswer" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable update for all users" ON "public"."PupilMarks" FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."ClassMembership" FOR UPDATE TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."ClassPapers" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."FCUSerQueueEntries" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."FCUserQuestionHistory" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."Profile" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."Questions" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."TBD-ClassPaperResources" FOR UPDATE TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."dqAnswers" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."dqQuestionType" FOR UPDATE TO "authenticated" WITH CHECK (true);

ALTER TABLE "public"."FCQuestions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."FCUSerQueueEntries" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."FCUserQuestionHistory" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."FCUserQueues" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Papers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Profile" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."PupilMarks" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."PupilMarks_2024_03_29" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."QPAnswer" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Questions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Spec" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."SpecItem" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."SpecUnits" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."TBD-ClassPaperResources" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Tasks" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."WorkQueue" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."WorkUploads" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."dqAnswers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."dqPage" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."dqQuestionType" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."dqQuestions" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."ClassMembership";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."FCQuestions";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."QPAnswer";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."SpecUnits";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."TBD-ClassPaperResources";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."dqAnswers";

GRANT USAGE ON SCHEMA "dailyquestion" TO "anon";
GRANT USAGE ON SCHEMA "dailyquestion" TO "authenticated";
GRANT USAGE ON SCHEMA "dailyquestion" TO "service_role";

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", integer, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", integer, "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", "text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", "text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", "text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", "text", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", "text", integer, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", "text", integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", "text", integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."connectby"("text", "text", "text", "text", "text", integer, "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."crosstab"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."crosstab"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."crosstab"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."crosstab"("text") TO "service_role";

GRANT ALL ON FUNCTION "public"."crosstab"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."crosstab"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."crosstab"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."crosstab"("text", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."crosstab"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."crosstab"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."crosstab"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."crosstab"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."crosstab2"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."crosstab2"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."crosstab2"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."crosstab2"("text") TO "service_role";

GRANT ALL ON FUNCTION "public"."crosstab3"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."crosstab3"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."crosstab3"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."crosstab3"("text") TO "service_role";

GRANT ALL ON FUNCTION "public"."crosstab4"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."crosstab4"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."crosstab4"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."crosstab4"("text") TO "service_role";

GRANT ALL ON FUNCTION "public"."dq_getspecitemquestioncount"("_specid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."dq_getspecitemquestioncount"("_specid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dq_getspecitemquestioncount"("_specid" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."dq_loadnextquestionbycode"("_code" "text", "_owner" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."dq_loadnextquestionbycode"("_code" "text", "_owner" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."dq_loadnextquestionbycode"("_code" "text", "_owner" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."dq_loadnextquestionbyspecitem"("_specitemid" bigint, "_owner" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."dq_loadnextquestionbyspecitem"("_specitemid" bigint, "_owner" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."dq_loadnextquestionbyspecitem"("_specitemid" bigint, "_owner" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."dq_loadquestionbyid"("_questionid" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."dq_loadquestionbyid"("_questionid" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dq_loadquestionbyid"("_questionid" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."dq_loadquestionbyspecitemid"("_specitemid" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."dq_loadquestionbyspecitemid"("_specitemid" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dq_loadquestionbyspecitemid"("_specitemid" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_admin_get_all_papers_for_class_spec"("classTag" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_admin_get_all_papers_for_class_spec"("classTag" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_admin_get_all_papers_for_class_spec"("classTag" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_admin_get_papers_for_class"("_classid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_admin_get_papers_for_class"("_classid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_admin_get_papers_for_class"("_classid" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_check_class"("classid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_check_class"("classid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_check_class"("classid" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_check_class_spec_item"("classid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_check_class_spec_item"("classid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_check_class_spec_item"("classid" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_check_paper_for_class"("paperid" integer, "classid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_check_paper_for_class"("paperid" integer, "classid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_check_paper_for_class"("paperid" integer, "classid" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_fc_add_spec_item_to_pupil_queue"("_userid" "uuid", "_specitemid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_fc_add_spec_item_to_pupil_queue"("_userid" "uuid", "_specitemid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_fc_add_spec_item_to_pupil_queue"("_userid" "uuid", "_specitemid" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_fc_get_distractors"("_specid" bigint, "_qid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_fc_get_distractors"("_specid" bigint, "_qid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_fc_get_distractors"("_specid" bigint, "_qid" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_fc_get_next_question"("_userid" "uuid", "_specitemid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_fc_get_next_question"("_userid" "uuid", "_specitemid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_fc_get_next_question"("_userid" "uuid", "_specitemid" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_fc_get_queue"("_userid" "uuid", "_specitemid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_fc_get_queue"("_userid" "uuid", "_specitemid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_fc_get_queue"("_userid" "uuid", "_specitemid" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_fc_get_queue_summary"("_userid" "uuid", "_specitemid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_fc_get_queue_summary"("_userid" "uuid", "_specitemid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_fc_get_queue_summary"("_userid" "uuid", "_specitemid" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_fc_get_queues"("_userid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_fc_get_queues"("_userid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_fc_get_queues"("_userid" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_get_paper_data_for_pupil"("pupilid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_get_paper_data_for_pupil"("pupilid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_get_paper_data_for_pupil"("pupilid" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_get_paper_details_for_pupil"("_owner" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_get_paper_details_for_pupil"("_owner" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_get_paper_details_for_pupil"("_owner" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_get_papers_for_class"("_classid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_get_papers_for_class"("_classid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_get_papers_for_class"("_classid" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_get_pupil_marks_for_assigned_papers_by_class"("_pupilid" "text", "_classid" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_get_pupil_marks_for_assigned_papers_by_class"("_pupilid" "text", "_classid" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_get_pupil_marks_for_assigned_papers_by_class"("_pupilid" "text", "_classid" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_get_specitemmarks_for_pupil_class"("_pupilid" "text", "_classid" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_get_specitemmarks_for_pupil_class"("_pupilid" "text", "_classid" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_get_specitemmarks_for_pupil_class"("_pupilid" "text", "_classid" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_marks_entered"("paperid" integer, "classid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_marks_entered"("paperid" integer, "classid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_marks_entered"("paperid" integer, "classid" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_available_from_date"("uuid" "uuid", "specid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_available_from_date"("uuid" "uuid", "specid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_available_from_date"("uuid" "uuid", "specid" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_available_marks"("userid" "uuid", "specid" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_available_marks"("userid" "uuid", "specid" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_available_marks"("userid" "uuid", "specid" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_paper"("uuid" "uuid", "specid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_paper"("uuid" "uuid", "specid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_paper"("uuid" "uuid", "specid" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_spec_item"("userid" "uuid", "specid" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_spec_item"("userid" "uuid", "specid" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_spec_item"("userid" "uuid", "specid" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_spec_item"("userid" "uuid", "specid" bigint, "classid" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_spec_item"("userid" "uuid", "specid" bigint, "classid" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_pupil_marks_by_spec_item"("userid" "uuid", "specid" bigint, "classid" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_pupil_marks_for_all_papers"("_userid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_pupil_marks_for_all_papers"("_userid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_pupil_marks_for_all_papers"("_userid" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_pupilmarks_by_specitem"("userid" "uuid", "specid" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_pupilmarks_by_specitem"("userid" "uuid", "specid" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_pupilmarks_by_specitem"("userid" "uuid", "specid" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_qp_get_current_answers"("_userid" "uuid", "_path" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_qp_get_current_answers"("_userid" "uuid", "_path" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_qp_get_current_answers"("_userid" "uuid", "_path" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_tdf_get_queue"("pid" "uuid", "questionsetid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_tdf_get_queue"("pid" "uuid", "questionsetid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_tdf_get_queue"("pid" "uuid", "questionsetid" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_test_vars"() TO "anon";
GRANT ALL ON FUNCTION "public"."fn_test_vars"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_test_vars"() TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_upsert_pupilmarks"("_paperid" integer, "_questionid" integer, "_userid" "uuid", "_marks" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_upsert_pupilmarks"("_paperid" integer, "_questionid" integer, "_userid" "uuid", "_marks" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_upsert_pupilmarks"("_paperid" integer, "_questionid" integer, "_userid" "uuid", "_marks" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_class_marks"("class_tag" "text", "paper_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_class_marks"("class_tag" "text", "paper_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_class_marks"("class_tag" "text", "paper_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_papers_class_tag"("class_tag" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_papers_class_tag"("class_tag" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_papers_class_tag"("class_tag" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."helloworld"("_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."helloworld"("_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."helloworld"("_name" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."normal_rand"(integer, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."normal_rand"(integer, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."normal_rand"(integer, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."normal_rand"(integer, double precision, double precision) TO "service_role";

GRANT ALL ON TABLE "dailyquestion"."question" TO "anon";
GRANT ALL ON TABLE "dailyquestion"."question" TO "authenticated";
GRANT ALL ON TABLE "dailyquestion"."question" TO "service_role";

GRANT ALL ON TABLE "dailyquestion"."questionType" TO "anon";
GRANT ALL ON TABLE "dailyquestion"."questionType" TO "authenticated";
GRANT ALL ON TABLE "dailyquestion"."questionType" TO "service_role";

GRANT ALL ON SEQUENCE "dailyquestion"."questionType_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "dailyquestion"."questionType_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "dailyquestion"."questionType_id_seq" TO "service_role";

GRANT ALL ON TABLE "dailyquestion"."salaries" TO "anon";
GRANT ALL ON TABLE "dailyquestion"."salaries" TO "authenticated";
GRANT ALL ON TABLE "dailyquestion"."salaries" TO "service_role";

GRANT ALL ON SEQUENCE "dailyquestion"."salaries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "dailyquestion"."salaries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "dailyquestion"."salaries_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."ClassMembership" TO "anon";
GRANT ALL ON TABLE "public"."ClassMembership" TO "authenticated";
GRANT ALL ON TABLE "public"."ClassMembership" TO "service_role";

GRANT ALL ON TABLE "public"."TBD-ClassPaperResources" TO "anon";
GRANT ALL ON TABLE "public"."TBD-ClassPaperResources" TO "authenticated";
GRANT ALL ON TABLE "public"."TBD-ClassPaperResources" TO "service_role";

GRANT ALL ON SEQUENCE "public"."ClassPaperResources_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ClassPaperResources_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ClassPaperResources_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."ClassPapers" TO "anon";
GRANT ALL ON TABLE "public"."ClassPapers" TO "authenticated";
GRANT ALL ON TABLE "public"."ClassPapers" TO "service_role";

GRANT ALL ON TABLE "public"."Classes" TO "anon";
GRANT ALL ON TABLE "public"."Classes" TO "authenticated";
GRANT ALL ON TABLE "public"."Classes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Classes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Classes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Classes_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."FCQuestions" TO "anon";
GRANT ALL ON TABLE "public"."FCQuestions" TO "authenticated";
GRANT ALL ON TABLE "public"."FCQuestions" TO "service_role";

GRANT ALL ON TABLE "public"."FCUSerQueueEntries" TO "anon";
GRANT ALL ON TABLE "public"."FCUSerQueueEntries" TO "authenticated";
GRANT ALL ON TABLE "public"."FCUSerQueueEntries" TO "service_role";

GRANT ALL ON SEQUENCE "public"."FCUSerQueueEntries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."FCUSerQueueEntries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."FCUSerQueueEntries_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."FCUserQuestionHistory" TO "anon";
GRANT ALL ON TABLE "public"."FCUserQuestionHistory" TO "authenticated";
GRANT ALL ON TABLE "public"."FCUserQuestionHistory" TO "service_role";

GRANT ALL ON SEQUENCE "public"."FCUserQuestionHistory_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."FCUserQuestionHistory_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."FCUserQuestionHistory_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."FCUserQueues" TO "anon";
GRANT ALL ON TABLE "public"."FCUserQueues" TO "authenticated";
GRANT ALL ON TABLE "public"."FCUserQueues" TO "service_role";

GRANT ALL ON TABLE "public"."Papers" TO "anon";
GRANT ALL ON TABLE "public"."Papers" TO "authenticated";
GRANT ALL ON TABLE "public"."Papers" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Papers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Papers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Papers_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."Profile" TO "anon";
GRANT ALL ON TABLE "public"."Profile" TO "authenticated";
GRANT ALL ON TABLE "public"."Profile" TO "service_role";

GRANT ALL ON TABLE "public"."PupilMarks" TO "anon";
GRANT ALL ON TABLE "public"."PupilMarks" TO "authenticated";
GRANT ALL ON TABLE "public"."PupilMarks" TO "service_role";

GRANT ALL ON TABLE "public"."PupilMarks_2024_03_29" TO "anon";
GRANT ALL ON TABLE "public"."PupilMarks_2024_03_29" TO "authenticated";
GRANT ALL ON TABLE "public"."PupilMarks_2024_03_29" TO "service_role";

GRANT ALL ON SEQUENCE "public"."PupilMarks_duplicate_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."PupilMarks_duplicate_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."PupilMarks_duplicate_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."QPAnswer" TO "anon";
GRANT ALL ON TABLE "public"."QPAnswer" TO "authenticated";
GRANT ALL ON TABLE "public"."QPAnswer" TO "service_role";

GRANT ALL ON SEQUENCE "public"."QPAnswer_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."QPAnswer_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."QPAnswer_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."Questions" TO "anon";
GRANT ALL ON TABLE "public"."Questions" TO "authenticated";
GRANT ALL ON TABLE "public"."Questions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Questions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Questions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Questions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."Spec" TO "anon";
GRANT ALL ON TABLE "public"."Spec" TO "authenticated";
GRANT ALL ON TABLE "public"."Spec" TO "service_role";

GRANT ALL ON TABLE "public"."SpecItem" TO "anon";
GRANT ALL ON TABLE "public"."SpecItem" TO "authenticated";
GRANT ALL ON TABLE "public"."SpecItem" TO "service_role";

GRANT ALL ON SEQUENCE "public"."SpecItem_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."SpecItem_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."SpecItem_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."SpecUnits" TO "anon";
GRANT ALL ON TABLE "public"."SpecUnits" TO "authenticated";
GRANT ALL ON TABLE "public"."SpecUnits" TO "service_role";

GRANT ALL ON SEQUENCE "public"."SpecUnits_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."SpecUnits_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."SpecUnits_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Spec_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Spec_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Spec_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."Tasks" TO "anon";
GRANT ALL ON TABLE "public"."Tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."Tasks" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Tasks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Tasks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Tasks_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."UserMarks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."UserMarks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."UserMarks_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."WorkQueue" TO "anon";
GRANT ALL ON TABLE "public"."WorkQueue" TO "authenticated";
GRANT ALL ON TABLE "public"."WorkQueue" TO "service_role";

GRANT ALL ON SEQUENCE "public"."WorkQueue_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."WorkQueue_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."WorkQueue_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."WorkUploads" TO "anon";
GRANT ALL ON TABLE "public"."WorkUploads" TO "authenticated";
GRANT ALL ON TABLE "public"."WorkUploads" TO "service_role";

GRANT ALL ON SEQUENCE "public"."WorkUploads_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."WorkUploads_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."WorkUploads_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."__specid" TO "anon";
GRANT ALL ON TABLE "public"."__specid" TO "authenticated";
GRANT ALL ON TABLE "public"."__specid" TO "service_role";

GRANT ALL ON TABLE "public"."cat_names" TO "anon";
GRANT ALL ON TABLE "public"."cat_names" TO "authenticated";
GRANT ALL ON TABLE "public"."cat_names" TO "service_role";

GRANT ALL ON TABLE "public"."dqAnswers" TO "anon";
GRANT ALL ON TABLE "public"."dqAnswers" TO "authenticated";
GRANT ALL ON TABLE "public"."dqAnswers" TO "service_role";

GRANT ALL ON TABLE "public"."dqPage" TO "anon";
GRANT ALL ON TABLE "public"."dqPage" TO "authenticated";
GRANT ALL ON TABLE "public"."dqPage" TO "service_role";

GRANT ALL ON TABLE "public"."dqQuestionType" TO "anon";
GRANT ALL ON TABLE "public"."dqQuestionType" TO "authenticated";
GRANT ALL ON TABLE "public"."dqQuestionType" TO "service_role";

GRANT ALL ON SEQUENCE "public"."dqQuestionType_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."dqQuestionType_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."dqQuestionType_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."dqQuestions" TO "anon";
GRANT ALL ON TABLE "public"."dqQuestions" TO "authenticated";
GRANT ALL ON TABLE "public"."dqQuestions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."dqQuestions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."dqQuestions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."dqQuestions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."dq_vw_answers" TO "anon";
GRANT ALL ON TABLE "public"."dq_vw_answers" TO "authenticated";
GRANT ALL ON TABLE "public"."dq_vw_answers" TO "service_role";

GRANT ALL ON TABLE "public"."result_record" TO "anon";
GRANT ALL ON TABLE "public"."result_record" TO "authenticated";
GRANT ALL ON TABLE "public"."result_record" TO "service_role";

GRANT ALL ON TABLE "public"."test" TO "anon";
GRANT ALL ON TABLE "public"."test" TO "authenticated";
GRANT ALL ON TABLE "public"."test" TO "service_role";

GRANT ALL ON TABLE "public"."vw_class_lists" TO "anon";
GRANT ALL ON TABLE "public"."vw_class_lists" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_class_lists" TO "service_role";

GRANT ALL ON TABLE "public"."vw_dq_answers_denormed" TO "anon";
GRANT ALL ON TABLE "public"."vw_dq_answers_denormed" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_dq_answers_denormed" TO "service_role";

GRANT ALL ON TABLE "public"."vw_dq_daily_pupil_answer_count" TO "anon";
GRANT ALL ON TABLE "public"."vw_dq_daily_pupil_answer_count" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_dq_daily_pupil_answer_count" TO "service_role";

GRANT ALL ON TABLE "public"."vw_dq_pupil_scores_last5days" TO "anon";
GRANT ALL ON TABLE "public"."vw_dq_pupil_scores_last5days" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_dq_pupil_scores_last5days" TO "service_role";

GRANT ALL ON TABLE "public"."vw_duplicate_pupil_marks" TO "anon";
GRANT ALL ON TABLE "public"."vw_duplicate_pupil_marks" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_duplicate_pupil_marks" TO "service_role";

GRANT ALL ON TABLE "public"."vw_marks_for_papers_by_tag" TO "anon";
GRANT ALL ON TABLE "public"."vw_marks_for_papers_by_tag" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_marks_for_papers_by_tag" TO "service_role";

GRANT ALL ON TABLE "public"."vw_paper_marks_for_pupil_detail" TO "anon";
GRANT ALL ON TABLE "public"."vw_paper_marks_for_pupil_detail" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_paper_marks_for_pupil_detail" TO "service_role";

GRANT ALL ON TABLE "public"."vw_papers_for_classes" TO "anon";
GRANT ALL ON TABLE "public"."vw_papers_for_classes" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_papers_for_classes" TO "service_role";

GRANT ALL ON TABLE "public"."vw_pupil_marks_denormed" TO "anon";
GRANT ALL ON TABLE "public"."vw_pupil_marks_denormed" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_pupil_marks_denormed" TO "service_role";

GRANT ALL ON TABLE "public"."vw_pupil_marks_for_spec" TO "anon";
GRANT ALL ON TABLE "public"."vw_pupil_marks_for_spec" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_pupil_marks_for_spec" TO "service_role";

GRANT ALL ON TABLE "public"."vw_questions_denorm" TO "anon";
GRANT ALL ON TABLE "public"."vw_questions_denorm" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_questions_denorm" TO "service_role";

GRANT ALL ON TABLE "public"."vw_user_marks_for_paper" TO "anon";
GRANT ALL ON TABLE "public"."vw_user_marks_for_paper" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_user_marks_for_paper" TO "service_role";

GRANT ALL ON TABLE "public"."vw_user_marks_for_paper_clone" TO "anon";
GRANT ALL ON TABLE "public"."vw_user_marks_for_paper_clone" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_user_marks_for_paper_clone" TO "service_role";

GRANT ALL ON TABLE "public"."vw_user_marks_for_spec" TO "anon";
GRANT ALL ON TABLE "public"."vw_user_marks_for_spec" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_user_marks_for_spec" TO "service_role";

GRANT ALL ON TABLE "public"."vw_wq_tickets" TO "anon";
GRANT ALL ON TABLE "public"."vw_wq_tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_wq_tickets" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "dailyquestion" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "dailyquestion" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "dailyquestion" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "dailyquestion" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "dailyquestion" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "dailyquestion" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "dailyquestion" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "dailyquestion" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "dailyquestion" GRANT ALL ON TABLES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
