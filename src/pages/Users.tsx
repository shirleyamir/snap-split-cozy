import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, UserPlus, Trash2, Users as UsersIcon } from "lucide-react";

const mockUsers = [
  { id: "1", name: "Alex", color: "bg-primary" },
  { id: "2", name: "Sam", color: "bg-secondary" },
  { id: "3", name: "Riley", color: "bg-accent" },
];

const Users = () => {
  const [users, setUsers] = useState(mockUsers);
  const [newUserName, setNewUserName] = useState("");

  const addUser = () => {
    if (newUserName.trim()) {
      const newUser = {
        id: Date.now().toString(),
        name: newUserName.trim(),
        color: "bg-primary"
      };
      setUsers([...users, newUser]);
      setNewUserName("");
    }
  };

  const removeUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-20">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Manage Users</h1>
              <p className="text-sm text-muted-foreground">Add friends to split bills with</p>
            </div>
            <div className="bg-primary-soft rounded-full p-2">
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Add New User */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Friend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter friend's name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addUser()}
                className="flex-1"
              />
              <Button onClick={addUser} disabled={!newUserName.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Users */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Friends ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UsersIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No friends added yet</p>
                <p className="text-sm">Add some friends to start splitting bills!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white text-sm font-medium`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUser(user.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-semibold text-primary">{users.length}</div>
                <div className="text-xs text-muted-foreground">Total Friends</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-primary">12</div>
                <div className="text-xs text-muted-foreground">Bills Together</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Users;