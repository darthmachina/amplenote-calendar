const plugin = 
{
  constants: {
    version: "1.0.0",
  },

  // --------------------------------------------------------------------------
  // https://www.amplenote.com/help/developing_amplenote_plugins#noteOption
  noteOption: {
    "Month": async function(app) {
      const sections = await app.getNoteSections({ uuid: app.context.noteUUID });
      const section = sections.find((section) => section.heading?.text === "Calendar");
      if (section === undefined) {
        app.alert("There needs to be a 'Calendar' section");
        return;
      }

      console.log(`Calendar section: ${JSON.stringify(section)}`);
      const dailyJots = await this._getDailyJotsForMonth(app);
      app.replaceNoteContent({ uuid: app.context.noteUUID }, this._createMonthlyCalendar(dailyJots), { section });
    },

    "Markdown": async function(app) {
      const content = await app.getNoteContent({ uuid: app.context.noteUUID });
      console.log(`content: ${content}`);
    }
  },

  // --------------------------------------------------------------------------
  // Impure Functions
  async _getDailyJotsForMonth(app) {
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();
    const dailyJots = await app.filterNotes({ tag: "daily-jots", query: `${month} ${year}` });
    console.log(`daily jots list: ${JSON.stringify(dailyJots)}`);
    const map = new Map(dailyJots
      .map(jot => {
        const day = jot.name.split(" ")[1].replace(/(st,|rd,|th,|nd,)/, "");
        console.log(`day for jot ${jot.name}: ${day}`);
        return [day, jot];
      })
    );
    console.log(`- to map: ${JSON.stringify(map)}`);
    return map;
  },

  // --------------------------------------------------------------------------
  // Pure Functions
  _createMonthlyCalendar(dailyJots) {
    console.log(`daily jots map: ${JSON.stringify(dailyJots)}`);
    const today = new Date();
    today.setDate(1);
    const dayOfWeek = today.getDay();
    console.log(`day of week: ${dayOfWeek}`);
    const totalDays = (new Date(today.getFullYear(), today.getMonth() + 1, 0)).getDate();
    console.log(`total Days: ${totalDays}`);
    const daysToPrint = Array.from(" ".repeat(dayOfWeek)).concat(Array.from({length: totalDays}, (e,i) => `${i + 1}`));
    console.log(`days to print: ${daysToPrint}`);

    const reducer = (content, day, index) => {
      const dayCell = dailyJots.has(day) ? `[${day}](https://www.amplenote.com/notes/${dailyJots[day].uuid})` : day;
      return content +
        "|" +
        dayCell +
        ((index + 1) % 7 === 0 ? "|\n" : ""); // If we have reached Sunday start a new row
    };

    const initialValue = "|S|M|T|W|T|F|S|\n|-|-|-|-|-|-|-|-|\n";

    const calendar = daysToPrint.reduce(reducer, initialValue);
    console.log(`calendar: ${calendar}`);
    return calendar;
  },
};
export default plugin;
