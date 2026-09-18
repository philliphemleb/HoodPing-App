import { createRouter, createWebHashHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import FeedView from "@/views/FeedView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/RegisterView.vue"),
    },
    { path: "/", name: "feed", component: FeedView },
    {
      path: "/chat",
      name: "chat",
      component: () => import("@/views/ChatView.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/views/ProfileView.vue"),
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("@/views/SettingsView.vue"),
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

router.beforeEach((to) => {
  const userStore = useUserStore();
  if (to.name !== "login" && to.name !== "register" && !userStore.isLoggedIn) {
    return { name: "login" };
  }
});

export default router;
