CREATE EXTENSION IF NOT EXISTS postgis;

-- Ensure GIST indexes are ready for when Django migrates the Facility model
CREATE INDEX IF NOT EXISTS facility_location_gist 
ON esg_facility USING GIST (location);