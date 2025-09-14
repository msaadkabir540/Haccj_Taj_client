/**
 * Represents the structure of an Employee object,
 * as received from the API within an attendance record.
 */
export interface Employee {
  id: number;
  employeecode: number;
  name: string;
  email: string;
  dob: string;

  contact_no: string;
  address: string;
  department: string;
  isadmin: 0 | 1;
  quit: "0" | "1";
  quit_date: string | null;
  CREATED_AT: string;
  updated_at: string;
  updated_by: string | null;
}

/**
 * Represents a single attendance record from the API response.
 */
export interface AttendanceRecord {
  id: number;
  location: string;
  time: string;
  latitude: number; // add this
  longitude: number;
  employeecode: string; // This is a string in the parent object
  created_at: string;
  updated_at: string;
  employee: Employee;
}

/**
 * Represents an attendance record after being enriched with the employee's name.
 */
export interface EnrichedAttendanceRecord extends AttendanceRecord {
  employeeName: string;
}

import React, { useEffect, useMemo, useState } from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Component Imports ---
import { Columns } from "./columns";
import Table from "@/components/table";
import Button from "@/components/button";
import Modal from "@/components/modal";
import HeadingText from "@/components/heading-text";
import createNotification from "@/common/create-notification";

// --- API & Context Imports ---
import { getAttendance } from "@/api-services/attendance";

// --- Style Imports ---
import styles from "./index.module.scss";
import moment from "moment";
import { useClients } from "@/context/context-collection";
import Selection from "@/components/selection";
import { useForm } from "react-hook-form";
import { handleExportReport } from "./helper";

const Attendance: React.FC = () => {
  const { control, watch } = useForm();

  // --- State Definitions ---
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<{
    fromDate: string;
    toDate: string;
  }>({
    fromDate: "",
    toDate: "",
  });
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);

  const loggedInEmployeeCode = localStorage.getItem("employeecode") || "";

  const context = useClients();
  const allEmployees = context ? context?.allEmployees : [];

  const employeeOptions =
    allEmployees?.map((data: any) => ({
      value: data?.employeecode,
      label: data?.name,
    })) || [];

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      // Only pass parameters if filter is active
      const params: Record<string, string> = {};
      if (isFilterActive && dateFilter.fromDate) params.fromDate = dateFilter.fromDate;
      if (isFilterActive && dateFilter.toDate) params.toDate = dateFilter.toDate;
      if (isFilterActive && watch("employeeId"))
        params.employeeId = watch("employeeId")?.value ?? "";

      const response = await getAttendance({
        form_date: dateFilter.fromDate,
        to_date: dateFilter.toDate,
        employeeCode: loggedInEmployeeCode,
        employeeId: params?.employeeId ?? "",
      });
      if (response?.status === 200) {
        const records = response?.data;
        setAttendanceRecords(records);
      } else {
        createNotification({
          type: "error",
          message: response.message || "Failed to fetch data.",
        });
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      createNotification({
        type: "error",
        message: "An error occurred while fetching attendance.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // --- Data Fetching ---
  useEffect(() => {
    if (loggedInEmployeeCode) {
      fetchAttendanceData();
    }
  }, [refetchTrigger, isFilterActive, loggedInEmployeeCode]);

  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilter = () => {
    setIsFilterActive(true);
    setRefetchTrigger((prev) => prev + 1);
    setIsFilterModalOpen(false);
  };

  const handleClearFilter = () => {
    setDateFilter({
      fromDate: "",
      toDate: "",
    });
    setIsFilterActive(false);
    setRefetchTrigger((prev) => prev + 1);
    setIsFilterModalOpen(false);
  };

  const attendanceRecordsData = useMemo(() => {
    return attendanceRecords?.map((data: any) => {
      const checkIn = data?.check_in; // check-in
      const checkOut = (data as any)?.check_out;

      // Calculate total working hours
      let totalHours = "0";
      if (checkIn && checkOut) {
        const duration = moment(checkOut).diff(moment(checkIn), "minutes");
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        totalHours = `${hours}h ${minutes}m`;
      }

      return {
        id: data?.id,
        employeeName: data?.employee?.name,
        check_in: checkIn,
        check_out: checkOut,
        total_hours: totalHours,
        check_in_location: data?.check_in_latitude && data?.check_in_longitude ? "Available" : "",
        check_out_location:
          (data as any)?.check_out_latitude && (data as any)?.check_out_longitude
            ? "Available"
            : "",
        check_in_lat: (data as any)?.check_in_latitude,
        check_in_lng: (data as any)?.check_in_longitude,
        check_out_lat: (data as any)?.check_out_latitude,
        check_out_lng: (data as any)?.check_out_longitude,
        onOpenMap: (lat: number, lng: number) => {
          setMapCoords({ lat, lng });
          setIsMapModalOpen(true);
        },
      };
    });
  }, [attendanceRecords]);

  const handleExportFile = () => {
    handleExportReport({ attendanceRecords });
  };

  return (
    <div className={styles.userContainer}>
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <HeadingText heading={"Employee Attendance"} text="A log of all employee check-ins." />
          <div className={styles.btnContainer}>
            {isFilterActive && (
              <Button
                type="button"
                title="Clear Filter"
                className={styles.clearFilterBtn}
                handleClick={handleClearFilter}
              />
            )}
            <Button
              type="button"
              // icon={filterIcon}
              title="Filter by Date"
              className={styles.filterButton}
              handleClick={handleOpenFilterModal}
            />
            <Button
              type="button"
              title="Export Report"
              className={styles.exportButton}
              handleClick={handleExportFile}
            />
          </div>
        </div>

        {/* Filter Modal */}
        {isFilterModalOpen && (
          <Modal
            open={isFilterModalOpen}
            handleClose={handleCloseFilterModal}
            className={styles.filterModal}
          >
            <div className={styles.filterForm}>
              <Selection
                label="Employee"
                isMulti={false}
                name="employeeId"
                control={control}
                className={styles.selectionLabel}
                options={employeeOptions}
                // errorMessage={error?.assignTo}
              />
              <div className={styles.formGroup}>
                <label htmlFor="fromDate">From Date</label>
                <input
                  type="date"
                  id="fromDate"
                  value={dateFilter.fromDate}
                  onChange={(e) => setDateFilter({ ...dateFilter, fromDate: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="toDate">To Date</label>
                <input
                  type="date"
                  id="toDate"
                  value={dateFilter.toDate}
                  onChange={(e) => setDateFilter({ ...dateFilter, toDate: e.target.value })}
                />
              </div>
              <div className={styles.modalActions}>
                <Button
                  type="button"
                  title="Apply Filter"
                  className={styles.applyButton}
                  handleClick={handleApplyFilter}
                />
                <Button
                  type="button"
                  title="Cancel"
                  className={styles.cancelButton}
                  handleClick={handleCloseFilterModal}
                />
              </div>
            </div>
          </Modal>
        )}

        <Table
          rows={attendanceRecordsData as any}
          columns={Columns}
          isLoading={isLoading}
          tableCustomClass={styles.tableCustomClass}
        />
      </div>
      {isMapModalOpen && (
        <Modal
          open={isMapModalOpen}
          handleClose={() => setIsMapModalOpen(false)}
          className={styles.ModalClassName}
        >
          <div className={styles.mapContainer}>
            {mapCoords ? (
              <iframe
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=16&output=embed`}
              />
            ) : (
              <p>No location available</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Attendance;
