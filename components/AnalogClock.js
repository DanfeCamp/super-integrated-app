const AnalogClock = ({ time }) => {
  const clockNumbers = Array.from({ length: 12 }, (_, i) => i + 1);

  const timing = {
    updateSeconds: { transform: `rotate(${time.getSeconds() * 6}deg)` },
    updateMinutes: { transform: `rotate(${time.getMinutes() * 6}deg)` },
    updateHours: {
      transform: `rotate(${time.getHours() * 30 + time.getMinutes() / 2}deg)`,
    },
  };

  const size = {
    dimension: "w-56 h-56",
    numbers: "inset-2 text-2xl",
    center: "h-4 w-4 -bottom-[3px]",
    hands: {
      hour: "h-[4.5em] w-[0.3em]",
      minute: "h-[6.5em] w-[0.2em]",
      second: "h-[6.5em] w-[0.09em]",
    },
  };

  const theme = {
    main: "bg-neutral-300 text-black-700",
    shadow:
      "ring-offset-[2px] ring-[10px] shadow-[10px 5px 10px rgba(0, 0, 0, 1)]",
    hand: {
      center: "bg-teal-700 before:bg-neutral-300",
      second: "bg-teal-600",
      minute: "bg-teal-700",
      hour: "bg-teal-700",
    },
  };

  return (
    <div className="flex w-full cursor-pointer flex-wrap items-center justify-center gap-x-40 gap-y-0">
      <div className="group relative flex cursor-pointer items-center justify-center text-sm">
        <div
          className={`${size?.dimension} ${theme?.main} ${theme?.shadow} relative top-2 my-6 flex items-center justify-center rounded-full`}
        >
          {clockNumbers.map((num) => (
            <label
              key={num}
              className={`absolute ${size?.numbers} text-center`}
              style={{ transform: `rotate(calc(${num}*(360deg/12)))` }}
            >
              <span
                className={`inline-block`}
                style={{ transform: `rotate(calc(${num}*(-360deg/12)))` }}
              >
                {num}
              </span>
            </label>
          ))}

          <section className="box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); absolute z-50 flex h-4 w-4 justify-center">
            {/* Clock center */}
            <span
              className={`${size?.center} ${theme?.hand.center} absolute z-50 flex rounded-full before:absolute before:left-0.5 before:top-0.5 before:h-3 before:w-3 before:justify-center before:rounded-full`}
            ></span>
            {/* Second hand */}
            <span
              className={`${size?.hands?.second} ${theme?.hand.second} absolute bottom-1.5 z-30 w-1 origin-bottom rounded-md`}
              style={timing.updateSeconds}
            ></span>
            {/* Minute hand */}
            <span
              className={`${size?.hands?.minute} ${theme?.hand.minute} absolute bottom-1.5 z-20 origin-bottom rounded-md`}
              style={timing.updateMinutes}
            ></span>
            {/* Hour hand */}
            <span
              className={`${size?.hands?.hour} ${theme?.hand.hour} absolute bottom-1.5 z-10 origin-bottom divide-zinc-100 rounded-md`}
              style={timing.updateHours}
            ></span>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnalogClock;
