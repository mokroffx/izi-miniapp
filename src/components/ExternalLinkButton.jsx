// A Button that opens an external https link via the SDK's openLink() (in-app
// browser, Mini App stays open) instead of a normal navigation. Used anywhere
// the app links out to the dashboard or a payment page — factored out because
// the `as="a" href={url} onClick={preventDefault + openExternalLink}` triplet
// was repeated identically across several screens.
import Button from '@/components/Button';
import { openExternalLink } from '@/telegram/sdk';

export default function ExternalLinkButton({ href, children, ...props }) {
  return (
    <Button
      as="a"
      href={href || '#'}
      onClick={(e) => {
        e.preventDefault();
        openExternalLink(href);
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
