module.exports = {
  apps: [
    {
      name: 'strapi',
      cwd: '/home/deploy/strapi-cms',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};
