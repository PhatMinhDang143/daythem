import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginScreen } from './components/Auth/LoginScreen';
import { BRAND_AVATAR, BRAND_NAME } from './assets/brandAssets';

// Module Components
import { OverviewModule } from './components/Dashboard/OverviewModule';
import { StudentsModule } from './components/Students/StudentsModule';
import { ClassesModule } from './components/Classes/ClassesModule';
import { TimetableModule } from './components/Timetable/TimetableModule';
import { AttendanceModule } from './components/Attendance/AttendanceModule';
import { EvaluationsModule } from './components/Evaluations/EvaluationsModule';
import { GradesModule } from './components/Grades/GradesModule';
import { InvoicesModule } from './components/Invoices/InvoicesModule';
import { UsersModule } from './components/Users/UsersModule';
import { SettingsModule } from './components/Settings/SettingsModule';
import { ParentPortalModule } from './components/ParentPortal/ParentPortalModule';

const MainLayout: React.FC = () => {
  const { activeModule, setActiveModule, isAuthenticated, centerSettings } = useApp();

  const [headerQuickAddStudent, setHeaderQuickAddStudent] = useState(false);
  const [headerQuickAddClass, setHeaderQuickAddClass] = useState(false);
  const [headerQuickAddInvoice, setHeaderQuickAddInvoice] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-[#172733] text-[#F4FCFB] font-sans overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <Header
          onOpenQuickAddStudent={() => {
            setActiveModule('students');
            setHeaderQuickAddStudent(true);
          }}
          onOpenQuickAddClass={() => {
            setActiveModule('classes');
            setHeaderQuickAddClass(true);
          }}
          onOpenQuickAddInvoice={() => {
            setActiveModule('invoices');
            setHeaderQuickAddInvoice(true);
          }}
        />

        {/* Dynamic Active Module View with Background Watermark */}
        <main className="flex-1 overflow-y-auto bg-[#172733] text-[#F4FCFB] relative">
          {/* Subtle Fixed Background Watermark Image */}
          <div className="fixed bottom-[-40px] right-[-40px] pointer-events-none opacity-[0.12] z-0">
            <img
              src={centerSettings.customLogoUrl || BRAND_AVATAR}
              alt={BRAND_NAME}
              className="w-[680px] h-[680px] object-contain drop-shadow-2xl"
            />
          </div>

          <div className="relative z-10">
            {activeModule === 'dashboard' && <OverviewModule />}
            {activeModule === 'students' && (
              <StudentsModule
                isAddModalOpenFromHeader={headerQuickAddStudent}
                onCloseHeaderModal={() => setHeaderQuickAddStudent(false)}
              />
            )}
            {activeModule === 'classes' && (
              <ClassesModule
                isAddModalOpenFromHeader={headerQuickAddClass}
                onCloseHeaderModal={() => setHeaderQuickAddClass(false)}
              />
            )}
            {activeModule === 'timetable' && <TimetableModule />}
            {activeModule === 'attendance' && <AttendanceModule />}
            {activeModule === 'evaluations' && <EvaluationsModule />}
            {activeModule === 'grades' && <GradesModule />}
            {activeModule === 'invoices' && (
              <InvoicesModule
                isAddModalOpenFromHeader={headerQuickAddInvoice}
                onCloseHeaderModal={() => setHeaderQuickAddInvoice(false)}
              />
            )}
            {activeModule === 'users' && <UsersModule />}
            {activeModule === 'settings' && <SettingsModule />}
            {activeModule === 'parent_portal' && <ParentPortalModule />}
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
