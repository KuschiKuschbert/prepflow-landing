export function ContactInformation() {
  return (
    <>
      <p className="mb-4 leading-relaxed text-gray-300">
        If you have any questions about these Terms of Service, please contact us:
      </p>
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <p className="mb-2 text-gray-300">
          <strong>Email:</strong>{' '}
          <a href="mailto:hello@prepflow.org" className="text-[#29E7CD] hover:underline">
            hello@prepflow.org
          </a>
        </p>
        <p className="mb-2 text-gray-300">
          <strong>Support:</strong>{' '}
          <a href="mailto:hello@prepflow.org" className="text-[#29E7CD] hover:underline">
            hello@prepflow.org
          </a>
        </p>
        <p className="text-gray-300">
          <strong>Response Time:</strong> We aim to respond to all inquiries within 48 hours
        </p>
      </div>
    </>
  );
}
