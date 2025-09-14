import createNotification from "@/common/create-notification";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";

export const handleExportReport = ({ attendanceRecords }: any) => {
  if (!attendanceRecords.length) {
    createNotification({ type: "error", message: "No records to export." });
    return;
  }

  const doc = new jsPDF();

  // Case 1: Single employee
  const uniqueEmployees: any = Array.from(
    new Map(
      attendanceRecords?.map((rec: any) => [rec.employee?.employeecode, rec.employee]),
    ).values(),
  );

  if (uniqueEmployees.length === 1) {
    const emp = uniqueEmployees[0];
    const employeeName = emp?.name || "N/A";
    const employeeCode = emp?.employeecode || "N/A";

    doc.setFontSize(14);
    doc.text("Attendance Report", 14, 15);

    doc.setFontSize(11);
    doc.text(`Employee: ${employeeName}`, 14, 25);
    doc.text(`Employee Code: ${employeeCode}`, 14, 32);
  } else {
    // Case 2: Multiple employees
    doc.setFontSize(14);
    doc.text("Attendance Report (All Employees)", 14, 15);

    doc.setFontSize(11);
    doc.text(`Total Employees: ${uniqueEmployees.length}`, 14, 25);
  }

  // Table rows
  const tableRows = attendanceRecords?.map((rec: any) => {
    const checkIn = rec?.check_in ? moment(rec.check_in).format("hh:mm A") : "-";
    const checkOut = rec?.check_out ? moment(rec.check_out).format("hh:mm A") : "-";

    let duration = "0";
    if (rec?.check_in && rec?.check_out) {
      const diffMins = moment(rec.check_out).diff(moment(rec.check_in), "minutes");
      const h = Math.floor(diffMins / 60);
      const m = diffMins % 60;
      duration = `${h}h ${m}m`;
    }

    return [
      rec?.employee?.name || "-",
      rec?.employee?.employeecode || "-",
      moment(rec?.check_in || rec?.check_out).format("dddd, MMMM D YYYY"),
      checkIn,
      checkOut,
      duration,
    ];
  });

  // Build table
  autoTable(doc, {
    startY: uniqueEmployees.length === 1 ? 40 : 35,
    head: [["Employee", "Code", "Date", "Check In", "Check Out", "Worked Hours"]],
    body: tableRows,
  });

  // Summary
  const worked = attendanceRecords?.filter((r: any) => r.check_in && r.check_out);
  const totalWorkedDays = worked?.length;
  const totalMinutes = worked?.reduce((acc: number, r: any) => {
    return acc + moment(r.check_out).diff(moment(r.check_in), "minutes");
  }, 0);
  const totalHours = (totalMinutes / 60).toFixed(2);

  const summaryY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text("Summary", 14, summaryY);
  doc.setFontSize(10);
  doc.text(`Total Records: ${attendanceRecords.length}`, 14, summaryY + 8);
  doc.text(`Working Days: ${totalWorkedDays}`, 14, summaryY + 16);
  doc.text(`Total Worked Hours: ${totalHours}`, 14, summaryY + 24);

  // Save file
  if (uniqueEmployees.length === 1) {
    const emp = uniqueEmployees[0];
    doc.save(`Attendance_Report_${emp?.name}.pdf`);
  } else {
    doc.save(`Attendance_Report_All_Employees.pdf`);
  }
};
