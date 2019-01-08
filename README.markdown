# JSBIN LOCAL

# 1 前端构建部署

``` shell
# 安装编译
npm install --dev
npm run build

# 不使用docker（需2、3完成后）
# 运行服务 方式1
./bin/jsbin
# 运行服务 方式2
npm start

# 构建docker镜像
docker build -t jsbin-local .
```

# 2 配置文件

## 2.1 不使用docker部署时

修改根目录下`config/config.local.json`修改mysql部分以及url部分。

## 2.2 使用docker部署时

将docker镜像中的`/usr/src/node/jsbin/config`目录映射到宿主机，并在宿主机对应目录下新建`config.local.json`文件，

文件内容参照根目录下`config/config.local.json`修改mysql部分以及url部分。

（如要修改端口，请同时修改url部分端口以及Dockerfile中的端口）

# 3 数据库配置

``` json
{
    "mysql": {
      "host": "数据库ip",
      "user": "数据库user",
      "password": "数据库password",
      "database": "jsbin",
      "charset": "utf8mb4",
      "collate": "utf8mb4_unicode_ci"
    }
}
```

根据`config/config.local.js`配置文件中的数据库配置， 在数据库中新建对应数据库，导入数据库表sql文件 -> `build/full-db-v3.mysql.sql`。

# 4 端口映射（docker部署时使用）

由于JSBIN生成的前端html文件中，包含有根据配置文件url中宿主机ip路径的静态资源文件，docker端口映射时，为避免不必要的问题，请尽量保持端口一致。
