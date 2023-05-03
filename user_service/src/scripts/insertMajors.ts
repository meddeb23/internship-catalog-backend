import connectToDB from "../infrastructure/database";
import { MajorModel } from "../infrastructure/model";

const majors = [
  "ING-A1-01",
  "ING-A1-02",
  "ING-A1-03",
  "ING-A1-04",
  "ING-A1-05",
  "ING-A2-GL-01",
  "ING-A2-GL-02",
  "ING-A2-GL-03",
  "ING-A2-GL-04",
  "ING-A3-GL-AL-01",
  "ING-A3-GL-AL-02",
  "ING-A3-GL-AL-03",
  "ING-A3-GL-AL-04",
  "Prepa-A1-01",
  "Prepa-A1-02",
  "Prepa-A1-03",
  "Prepa-A1-04",
  "Prepa-A2-01",
  "Prepa-A2-02",
  "Prepa-A2-03",
  "Prepa-A2-04",
  "LISI-A1-01",
  "LISI-A1-02",
  "LISI-A1-03",
  "LISI-A2-01",
  "LISI-A2-02",
  "LISI-A3-01",
  "LISI-A3-02",
  "LSI-A1-01",
  "LSI-A1-02",
  "LSI-A2-01",
  "LSI-A2-02",
  "LSI-A3-01",
  "LSI-A3-02",
];

connectToDB().then(async () => {
  console.log("Creating majors... 🚚");
  for (const major of majors) {
    await MajorModel.create({ name: major });
  }
  console.log("Major created ✅");
});
