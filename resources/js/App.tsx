import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import Posts from "./views/Posts";
import Login from "./views/Login";
import { AuthProvider } from "./context/auth";
import Navbar from "./components/layout/Navbar";
import Profile from "./views/Profile";
import Following from "./views/Following";
import Register from "./views/Register";
import ResetPassword from "./views/ResetPassword";
import Settings from "./views/Settings";

function App() {

    return (
        <AuthProvider>
            <div className="bg-gray-100 min-h-screen">
                <Router hook={useHashLocation}>
                    <Navbar />
                    <Switch>
                        <Route path="/" component={Posts} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/following" component={Following} />
                        <Route path="/settings" component={Settings} />
                        <Route path="/reset-password" component={ResetPassword} />
                        <Route path="/profile/:username" component={Profile} />
                        <Route>
                            404 not found
                        </Route>
                    </Switch>
                </Router>
            </div>
        </AuthProvider>
    )
}

export default App;
