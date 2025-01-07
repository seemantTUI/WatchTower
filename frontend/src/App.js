import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import NavBar from './components/NavBar';
import Rules from './pages/Rules';
import AddRules from './pages/AddRules';
import EditRule from './pages/EditRule';
import Metrics from './pages/Metrics';
import Notifications from './pages/Notifications';
import AddMetric from './pages/AddMetrics';
import EditMetric from './pages/EditMetric';

function App() {
  return (
    <div className="App">

      <BrowserRouter>
      <NavBar />
      <br/>
          <Routes>
            <Route
              path='/'
              element={<Home />}
            />
            <Route
              path='/rules'
              element={<Rules />}
            />
            <Route path="/rules/create/" element={<AddRules/>}/>
            <Route path="/rules/:id" element={<EditRule/>}/>
            <Route
              path='/metrics'
              element={<Metrics />}
            />
            <Route path="/metrics/create/" element={<AddMetric/>}/>
            <Route path="/metrics/:id" element={<EditMetric/>}/>
            <Route
              path='/notifications'
              element={<Notifications />}
            />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
