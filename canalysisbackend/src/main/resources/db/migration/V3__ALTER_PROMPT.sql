ALTER TABLE prompts ADD COLUMN name TEXT;

UPDATE prompts SET name = 'Prompt ' || id;

ALTER TABLE prompts ALTER COLUMN name SET NOT NULL;
ALTER TABLE prompts ADD CONSTRAINT unique_prompt_name UNIQUE (name);
