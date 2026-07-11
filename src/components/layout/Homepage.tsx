export default function Homepage() {
  return (
    <div className="flex flex-col items-center m-8 md:m-16">
      <h1 className="p-4 font-bold text-3xl md:text-4xl">
        Welcome to <span className="text-cyan-500">DefinitelyShowReady</span>!
      </h1>
      <h3>
        (which is definitely not a ripoff of a different program with a very
        similar name!)
      </h3>
      {/* <iframe src="https://outlook.office365.com/owa/calendar/0922c36df0874596bafefdceb8261917@olin.edu/a5a88ef8f36f40e192800a4e1bdefe7918049265861158770921/calendar.html" /> */}

      <div className="flex flex-col md:flex-row pt-10 gap-6">
        <div className="border w-full md:max-w-80 border-slate-300 rounded-md p-6">
          <h2 className="font-bold text-xl pb-2">Quick Links</h2>
          <ul>
            <li>
              <a
                href="https://drive.google.com/drive/u/0/folders/1t0m36WNsImSRF3RSFu6PgIJ3pKvEdAvT"
                className="underline text-cyan-700"
              >
                Alice By Heart Google Drive
              </a>
            </li>
            <li>
              <a
                href="https://drive.google.com/file/d/1qntWhS7FfXRi-hTmxEDAblWWAQLLjyhH/view?usp=drive_link"
                className="underline text-cyan-700"
              >
                Script + Vocal Book
              </a>
            </li>
          </ul>
        </div>
        <div className="border w-full md:max-w-80 border-slate-300 rounded-md p-6">
          <h2 className="font-bold text-xl pb-2">Important Dates</h2>
          <ul>
            <li>Off book for lines: __</li>
            <li>Off book for vocals: __</li>
            <li>Full vocal runthrough: __</li>
            <li>Paint Day: Sunday 11/1</li>
            <li>Build Day: Saturday 11/7</li>
            <li>Tech Week: 11/8-11/12</li>
            <li>Show Dates: Friday 11/13 & Saturday 11/14</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
