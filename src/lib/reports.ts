import jsPDF from "jspdf";
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

function addHeader(doc: jsPDF, title: string) {
  doc.setFillColor(16, 185, 129); // primary green
  doc.rect(0, 0, 210, 35, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("LifeOS", 14, 18);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(title, 14, 28);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 28);
  doc.setTextColor(0, 0, 0);
}

export function generateHealthReport(
  profile: any,
  healthProfile: any,
  healthLogs: any[]
) {
  const doc = new jsPDF();
  addHeader(doc, "Health & Wellness Report");

  let y = 45;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Profile Summary", 14, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const profileData = [
    ["Name", profile?.name || "—"],
    ["Age", profile?.age ? `${profile.age} years` : "—"],
    ["Height", profile?.height_cm ? `${profile.height_cm} cm` : "—"],
    ["Weight", profile?.weight_kg ? `${profile.weight_kg} kg` : "—"],
    ["BMI", profile?.bmi ? `${profile.bmi}` : "—"],
    ["Target Weight", healthProfile?.target_weight ? `${healthProfile.target_weight} kg` : "—"],
    ["Activity Level", healthProfile?.activity_level || "—"],
    ["Diet Preference", healthProfile?.diet_preference || "—"],
  ];

  doc.autoTable({
    startY: y,
    head: [["Metric", "Value"]],
    body: profileData,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129] },
    margin: { left: 14, right: 14 },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  if (healthLogs.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Daily Health Logs", 14, y);
    y += 5;

    const logData = healthLogs.map(l => [
      l.log_date,
      String(l.steps || 0),
      String(l.water_glasses || 0),
      String(l.exercise_minutes || 0),
      l.sleep_hours ? `${l.sleep_hours}h` : "—",
    ]);

    doc.autoTable({
      startY: y,
      head: [["Date", "Steps", "Water", "Exercise (min)", "Sleep"]],
      body: logData,
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129] },
      margin: { left: 14, right: 14 },
    });
  }

  doc.save("lifeos-health-report.pdf");
}

export function generateCareerReport(careerProfile: any, careerLogs: any[]) {
  const doc = new jsPDF();
  addHeader(doc, "Career Progress Report");

  let y = 45;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Career Profile", 14, y);
  y += 10;

  const profileData = [
    ["Profession", careerProfile?.profession || "—"],
    ["Industry", careerProfile?.industry || "—"],
    ["Experience", careerProfile?.years_experience ? `${careerProfile.years_experience} years` : "—"],
    ["Education", careerProfile?.education_level || "—"],
    ["Skills", careerProfile?.skills?.join(", ") || "—"],
    ["Tools", careerProfile?.tools_known?.join(", ") || "—"],
    ["Career Goals", careerProfile?.career_goals?.join(", ") || "—"],
  ];

  doc.autoTable({
    startY: y,
    head: [["Field", "Details"]],
    body: profileData,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: 14, right: 14 },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  if (careerLogs.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Learning Activity", 14, y);
    y += 5;

    const logData = careerLogs.map(l => [
      l.log_date,
      `${l.learning_hours || 0}h`,
      l.skills_studied?.join(", ") || "—",
      l.notes || "—",
    ]);

    doc.autoTable({
      startY: y,
      head: [["Date", "Hours", "Skills Studied", "Notes"]],
      body: logData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14, right: 14 },
    });
  }

  doc.save("lifeos-career-report.pdf");
}

export function generateProductivityReport(
  tasks: any[],
  habits: any[],
  habitLogs: any[]
) {
  const doc = new jsPDF();
  addHeader(doc, "Productivity Report");

  let y = 45;

  // Summary stats
  const completed = tasks.filter(t => t.completed).length;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", 14, y);
  y += 10;

  const summaryData = [
    ["Total Tasks", String(tasks.length)],
    ["Completed", String(completed)],
    ["Completion Rate", tasks.length ? `${Math.round((completed / tasks.length) * 100)}%` : "0%"],
    ["Active Habits", String(habits.length)],
    ["Habit Logs (30d)", String(habitLogs.length)],
  ];

  doc.autoTable({
    startY: y,
    head: [["Metric", "Value"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [139, 92, 246] },
    margin: { left: 14, right: 14 },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  // Task list
  if (tasks.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Tasks", 14, y);
    y += 5;

    const taskData = tasks.slice(0, 30).map(t => [
      t.title,
      t.priority || "medium",
      t.completed ? "✓ Done" : "Pending",
      t.category || "—",
    ]);

    doc.autoTable({
      startY: y,
      head: [["Title", "Priority", "Status", "Category"]],
      body: taskData,
      theme: "grid",
      headStyles: { fillColor: [139, 92, 246] },
      margin: { left: 14, right: 14 },
    });
  }

  doc.save("lifeos-productivity-report.pdf");
}
