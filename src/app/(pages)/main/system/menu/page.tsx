"use client";
import React, { createElement, useEffect, useState } from "react";
import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import * as Icon from "@ant-design/icons";
import { MENU_TYPE_MAP, STATUS } from "@/app/constant";

const Icons: { [key: string]: any } = Icon;

export interface MenuType {
  id: string;
  label: string;
  key: string;
  icon: string;
  parent?: string | null;
  parentMenu?: MenuType | null;
}

const pageSize = 10;


const MenuList: React.FC = () => {
  const router = useRouter();
  const [menus, setMenus] = useState<any>({ list: [] });
  const [pageNum, setPageNum] = useState(1);
  const menuController = api.menu.getMenuList.useMutation({
    onSuccess(data) {
      setMenus(data);
    }
  });
  useEffect(() => {
    menuController.mutate({
      pageNum,
      pageSize
    });
  }, []);

  const menuDeleteApi = api.menu.deleteMenuById.useMutation({
    onSuccess() {
      menuController.mutate({ pageNum, pageSize });
    }
  });
  const deleteMenu = (key: string) => {
    menuDeleteApi.mutate({ key });
  };

  const columns: ColumnsType<MenuType> = [
    {
      title: "标题",
      dataIndex: "label",
      key: "label",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => router.push(`/main/system/menu/view?id=${record.id}`)}
        >
          {text}
        </Button>
      )
    },
    {
      title: "地址",
      dataIndex: "key",
      key: "key"
    },
    {
      title: "类型",
      dataIndex: "menuType",
      key: "menuType",
      render: (menuType) => MENU_TYPE_MAP[menuType]
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => STATUS[status]
    },
    {
      title: "排序",
      dataIndex: "order",
      key: "order"
    },
    {
      title: "图标",
      dataIndex: "icon",
      key: "icon",
      render: (icon) => (icon ? createElement(Icons[icon]) : "-")
    },
    {
      title: "父级菜单",
      dataIndex: "id",
      key: "id",
      render: (text, record) => record.parentMenu?.label || "-"
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="删除用户"
            description={`确认删除菜单${record.label}?`}
            okText="确认"
            cancelText="取消"
            onConfirm={() => deleteMenu(record.key)}
          >
            <Button type="link">删除</Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() =>
              router.push(`/main/system/menu/edit?id=${record.id}`)
            }
          >
            编辑
          </Button>
        </Space>
      )
    }
  ];

  const changePage = (page: number, pageSize: number) => {
    setPageNum(page);
    menuController.mutate({
      pageNum: page,
      pageSize
    });
  };

  return (
    <div>
      <Space className="mb-4">
        <Button
          type="primary"
          onClick={() => router.push(`/main/system/menu/add`)}
        >
          新增菜单
        </Button>
      </Space>
      <Table
        loading={menuController.isLoading}
        columns={columns}
        dataSource={menus.list}
        rowKey="id"
        pagination={{ total: menus.total, pageSize, onChange: changePage }}
      />
    </div>
  );
};

export default MenuList;