// 演示配置文件
// 定义页面顺序、标题和每页对应的素材

const config = {
  pages: [
    {
      src: "pages/01-title.html",
      title: "封面",
      assets: []
    },
    {
      src: "pages/02-pain-point.html",
      title: "痛点共鸣",
      assets: []
    },
    {
      src: "pages/03-visual-compare.html",
      title: "视觉效果对比",
      assets: []
    },
    {
      src: "pages/04-time-cost.html",
      title: "时间成本对比",
      assets: []
    },
    {
      src: "pages/05-interaction-compare.html",
      title: "交互实现对比",
      assets: []
    },
    {
      src: "pages/06-fake-data.html",
      title: "假数据对比",
      assets: [
        {
          type: "video",
          src: "assets/videos/修正模拟数据.mp4",
          title: "修正模拟数据演示"
        }
      ]
    },
    {
      src: "pages/07-responsive.html",
      title: "响应式对比",
      assets: [
        {
          type: "page",
          src: "assets/demos/teacher-management.html",
          title: "教师管理页面演示"
        }
      ]
    }
  ]
};
