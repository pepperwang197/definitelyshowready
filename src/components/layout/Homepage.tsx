interface HomepageProps {
  info: any;
}

export default function Homepage(props: HomepageProps) {
  return (
    <div className="flex flex-col p-8 items-start md:items-center md:m-16 bg-white dark:bg-gray-900 text-black dark:text-white border-slate-300 dark:border-gray-600">
      <h1 className="pb-4 font-bold text-3xl md:text-4xl">
        Welcome to{" "}
        <span className="text-cyan-500">
          Definitely<span className="sm:hidden"> </span>ShowReady
        </span>
        !
      </h1>
      <h3>
        (which is definitely not a ripoff of a different program with a very
        similar name!)
      </h3>

      <div className="flex flex-col w-full md:w-auto md:flex-row pt-10 gap-6">
        {props.info &&
          props.info.map((section: any) => (
            <div
              key={section.title}
              className="border border-slate-300 dark:border-gray-600 md:w-full md:max-w-80 rounded-md p-6"
            >
              <h2 className="font-bold text-xl pb-2">{section.title}</h2>
              <ul>
                {typeof section.content[0] == "string"
                  ? section.content.map((item: string) => (
                      <li key={item}>{item}</li>
                    ))
                  : section.content.map((item: any) => (
                      <li key={item.text}>
                        <a
                          href={item.link}
                          className="underline text-cyan-700 dark:text-cyan-300"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}
