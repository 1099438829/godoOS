export const dbConfig = {
    dbName: "godoOS_DB",
    version: 1,
    tables: [
      {
        tableName: "filelist",
        option: { keyPath: "id", autoIncrement: true },
        indexs: [  // 创建索引 https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/createIndex
        {
          key: "id",
          option: {
            unique: true,
          },
        },
        {
          key: "path",
          option: {
            unique: true,
          },
        },
        {
          key: "title",
          option: {
            unique: false,
          },
        },
        {
            key: "parentId",
            option: {
              unique: false,
            },
        },
        {
            key: "deleteTime",
            option: {
              unique: false,
            },
        },
        {
          key: "type",
          option: {
            unique: false,
          },
      },
        // {
        //   key: "ext",
        //   option: {
        //     unique: false,
        //   },
        // },
      ],
      },
    ],
  };