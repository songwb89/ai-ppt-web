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
    },
    {
      src: "pages/08-solution-explore.html",
      title: "方案探索对比",
      assets: []
    },
    {
      src: "pages/09-tech-handoff.html",
      title: "技术对接对比",
      assets: []
    },
    {
      src: "pages/10-data-visualization.html",
      title: "数据可视化对比",
      assets: [
        {
          type: "page",
          src: "assets/demos/dashboard.html",
          title: "数据统计仪表盘演示"
        }
      ]
    },
    {
      src: "pages/11-flowchart.html",
      title: "流程图对比",
      assets: []
    },
    {
      src: "pages/12-modify-cost.html",
      title: "修改成本对比",
      assets: []
    },
    {
      src: "pages/13-doc-quality.html",
      title: "文档质量对比",
      assets: [
        {
          type: "link",
          src: "https://v3-0--whoot-student-mgmt.netlify.app/pages/student-management.html",
          title: "学生管理页面演示"
        }
      ]
    },
    {
      src: "pages/14-core-shift.html",
      title: "核心转变",
      assets: []
    },
    {
      src: "pages/15-chapter-prototype.html",
      title: "AI 画原型",
      assets: []
    }
  ]
};
