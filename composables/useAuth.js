export const useAuth = () => {
  const user = useState("user", () => null);
  const isLoggedIn = computed(() => !!user.value);

  const setUser = async (newUser) => {
    try {
      const response = await fetch("/api/settings");
      const settings = await response.json();
      const usernameSetting = settings.find(setting => setting.key === "username");
      
      if (!usernameSetting) {
        throw new Error("Username setting not found");
      }

      if (newUser && newUser.username === usernameSetting.value) {
        user.value = newUser;
        if (process.client) {
          localStorage.setItem("user", JSON.stringify(newUser));
        }
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  };

  const logout = () => {
    user.value = null;
    if (process.client) {
      localStorage.removeItem("user");
    }
  };

  if (process.client) {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser)).catch(() => {});
    }
  }

  watch(user, (newUser) => {});

  return {
    user,
    isLoggedIn,
    setUser,
    logout
  };
};
