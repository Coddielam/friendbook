import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>friendbook</title>
      </head>
      <body className="h-screen bg-gray-200 mx-auto pb-11 lg:max-w-5xl md:max-w-full sm:max-w-screen">
        {children}
      </body>
    </html>
  );
}
