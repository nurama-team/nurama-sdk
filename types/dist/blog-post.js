"use strict";
/**
 * Nurama News blog posts — sourced from the platform's external Ghost
 * CMS via the backend's `/v1/blog-posts` proxy. Authoring happens in
 * Ghost admin; the in-app surface is read-only.
 *
 * The proxy normalises Ghost's payload into the small `BlogPost`
 * envelope below so the FE doesn't depend on Ghost specifics and can be
 * pointed at a different CMS later without changing the renderer.
 */
Object.defineProperty(exports, "__esModule", { value: true });
