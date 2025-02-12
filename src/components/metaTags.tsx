import { useActiveRoute } from "~/hooks/useActiveRoute";
import { getGuide } from "~/guides";

export const MetaTags = () => {
  const [route] = useActiveRoute();

  const guide = route === "/" ? null : getGuide(route).meta;
  const title = guide?.title ?? "PokemonRNG.com";
  const description = guide?.description ?? "Guaranteed perfect shinies";

  // It's undefined behavior if these meta tags will replace the ones in index.html.
  // If they do, great.
  // If not, no worries.

  // At some point I should probably build static pages for better SEO.

  return (
    <>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="theme-color" content="#ffffff" />
      <link rel="icon" type="image/png" href="/jirachi.png?v=1" />

      {/* Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/jirachi.png?v=1" />
      <meta property="og:url" content="https://pokemonrng.com" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content="/jirachi.png?v=1" />
    </>
  );
};
