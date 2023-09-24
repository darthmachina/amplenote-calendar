const plugin = 
{
  Settings: class {
    constructor(dailyJotLink, sectionHeader) {
      this.dailyJotLink = dailyJotLink;
      this.sectionHeader = sectionHeader
    }
  },

  constants: {
    version: "1.1.0",
    settingDailyJotLinkName: "Link to Daily Jot (true/false, default true)",
    settingSectionHeaderName: "Section header (default 'Calendar')",
    monthNumberToName: {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December"
    }
  },

  // --------------------------------------------------------------------------
  // https://www.amplenote.com/help/developing_amplenote_plugins#noteOption
  noteOption: {
    "Month": async function(app) {
      const settings = new this.Settings(
        app.settings[this.constants.settingDailyJotLinkName] !== "false",
        app.settings[this.constants.settingSectionHeaderName] || "Calendar",
      );

      const sections = await app.getNoteSections({ uuid: app.context.noteUUID });
      const section = sections.find((section) => section.heading?.text === "Calendar");
      if (section === undefined) {
        app.alert("There needs to be a 'Calendar' section");
        return;
      }

      const dailyJots = settings.dailyJotLink ? await this._getDailyJotsForMonth(app) : new Map();
      app.replaceNoteContent({ uuid: app.context.noteUUID }, this._createMonthlyCalendar(dailyJots), { section });
    },
  },

  // --------------------------------------------------------------------------
  // Impure Functions
  async _getDailyJotsForMonth(app) {
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();
    const dailyJots = await app.filterNotes({ tag: "daily-jots", query: `${month} ${year}` });
    const map = dailyJots.reduce((map, jot) => {
      map.set(jot.name.split(" ")[1].replace(/(st,|rd,|th,|nd,)/, ""), jot);
      return map;
    }, new Map());
    return map;
  },

  // --------------------------------------------------------------------------
  // Pure Functions
  _createMonthlyCalendar(dailyJots) {
    const today = new Date();
    today.setDate(1);
    const dayOfWeek = today.getDay();
    const totalDays = (new Date(today.getFullYear(), today.getMonth() + 1, 0)).getDate();
    const daysToPrint = Array.from(" ".repeat(dayOfWeek)).concat(Array.from({length: totalDays}, (e,i) => `${i + 1}`));

    const reducer = (content, day, index) => {
      const dayCell = dailyJots.has(day) ? `[${day}](https://www.amplenote.com/notes/${dailyJots.get(day).uuid})` : day;
      return content +
        "|" +
        dayCell +
        ((index + 1) % 7 === 0 ? "|\n" : ""); // If we have reached Sunday start a new row
    };

    const initialValue = `### ${this.constants.monthNumberToName[today.getMonth()]}\n|S|M|T|W|T|F|S|\n|-|-|-|-|-|-|-|-|\n`;

    const calendar = daysToPrint.reduce(reducer, initialValue);
    return calendar;
  },
};
export default plugin;
