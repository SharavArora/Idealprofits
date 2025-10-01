import Dashboard from "./Dashboard";

const App: React.FC = () => {
  const currentUserId = 1; // Replace with actual logged-in user ID from auth

  return <Dashboard userId={currentUserId} />;
};

export default App;
