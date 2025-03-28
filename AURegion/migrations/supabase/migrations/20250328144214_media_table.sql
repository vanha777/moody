CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    path TEXT NOT NULL,
    belong_to VARCHAR NOT NULL,
    belong_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for faster lookups by belong_to and belong_id
CREATE INDEX IF NOT EXISTS idx_media_belong ON public.media (belong_to, belong_id);

-- Comment on table
COMMENT ON TABLE public.media IS 'Stores media files associated with various entities';
COMMENT ON COLUMN public.media.type IS 'Type of media (image, video, document, etc.)';
COMMENT ON COLUMN public.media.path IS 'Path or URL to the media file';
COMMENT ON COLUMN public.media.belong_to IS 'Entity type the media belongs to (e.g., services, people)';
COMMENT ON COLUMN public.media.belong_id IS 'ID of the entity the media belongs to';
