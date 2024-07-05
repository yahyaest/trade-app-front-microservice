import React, { useEffect, useState } from "react";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { Transaction } from "@/models/transaction";
import { Tag } from "primereact/tag";
import { formatCurrency } from "@/utils/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

export default function TransactionDataTable(props: any) {
  const transactions: Transaction[] = props.transactions;
  const { symbols, displayHeader } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const types = ["CRYPTO", "STOCKS", "FOREX"];
  const actions = ["BUY", "SELL"];

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const value = e.target.value;
    let _filters = { ...filters };
    (_filters["global"] as any).value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          className="w-fit p-1 sm:px-4"
          outlined
          onClick={clearFilter}
        />
        <span className="p-input-icon-left w-16rem sm:w-auto px-1">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  useEffect(() => {
    if (transactions) setLoading(false);

    transactions.map((transaction: Transaction) => {
      transaction.date = new Date(transaction.date as number);
      return transaction;
    });

    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (value: Date) => {
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      wallet: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      symbol: { value: null, matchMode: FilterMatchMode.IN },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      unit_price: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      amount: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      totalValue: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      action: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      type: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
    setGlobalFilterValue("");
  };

  const symbolBodyTemplate = (rowData: Transaction) => {
    const symbol = rowData.symbol;

    return (
      <React.Fragment>
        <img
          alt={symbol.name}
          src={`${symbol.coinImage}`}
          onError={(e) =>
            (e.currentTarget.src =
              "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
          }
          width={32}
          style={{ verticalAlign: "middle" }}
        />
        <span style={{ marginLeft: ".5em", verticalAlign: "middle" }}>
          {symbol.name}
        </span>
      </React.Fragment>
    );
  };

  const symbolFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <>
        <div className="mb-3 text-bold">Coin Picker</div>
        <MultiSelect
          value={options.value}
          options={symbols}
          itemTemplate={symbolsItemTemplate}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="name"
          placeholder="Any"
          className="p-column-filter"
        />
      </>
    );
  };

  const symbolsItemTemplate = (option: Transaction) => {
    return (
      <div className="p-multiselect-representative-option">
        <img
          alt={option.name}
          src={`${option.coinImage}`}
          width={32}
          style={{ verticalAlign: "middle" }}
        />
        <span style={{ marginLeft: ".5em", verticalAlign: "middle" }}>
          {option.name}
        </span>
      </div>
    );
  };

  const dateBodyTemplate = (rowData: Transaction) => {
    return formatDate(rowData.date as Date);
  };

  const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    );
  };

  const unitPriceBodyTemplate = (rowData: Transaction) => {
    return formatCurrency(+rowData.unit_price);
  };

  const totalValueBodyTemplate = (rowData: Transaction) => {
    return formatCurrency(rowData.totalValue as string);
  };

  const amountBodyTemplate = (rowData: Transaction) => {
    return rowData.amount;
  };

  const balanceFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const typeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={types}
        onChange={(e) => {
          options.filterCallback(e.value, options.index);
        }}
        itemTemplate={typeItemTemplate}
        placeholder="Select a Status"
        className="p-column-filter"
        showClear
      />
    );
  };

  const actionFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <Dropdown
        value={options.value}
        options={actions}
        onChange={(e) => {
          options.filterCallback(e.value, options.index);
        }}
        itemTemplate={actionItemTemplate}
        placeholder="Select a Status"
        className="p-column-filter"
        showClear
      />
    );
  };

  const getTypeSeverity = (type: string) => {
    switch (type) {
      case "FOREX":
        return "danger";

      case "STOCK":
        return "success";

      case "CRYPTO":
        return "info";
    }
  };

  const typeBodyTemplate = (rowData: Transaction) => {
    return (
      <Tag value={rowData.type} severity={getTypeSeverity(rowData.type)} />
    );
  };

  const typeItemTemplate = (option: string) => {
    return <Tag value={option} severity={getTypeSeverity(option)} />;
  };

  const getActionSeverity = (type: string) => {
    switch (type) {
      case "SELL":
        return "success";

      case "BUY":
        return "info";
    }
  };

  const actionBodyTemplate = (rowData: Transaction) => {
    return (
      <Tag
        value={rowData.action}
        severity={getActionSeverity(rowData.action)}
      />
    );
  };

  const actionItemTemplate = (option: string) => {
    return <Tag value={option} severity={getActionSeverity(option)} />;
  };

  const header = renderHeader();

  return (
    <React.Fragment>
      <DataTable
        value={transactions}
        paginator
        className="p-datatable-gridlines"
        showGridlines
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="menu"
        loading={loading}
        responsiveLayout="scroll"
        emptyMessage="No Transactions found."
        header={displayHeader ? header : null}
      >
        <Column
          field="wallet"
          header="Wallet"
          filter
          filterPlaceholder="Search by wallet"
          style={{ minWidth: "12rem" }}
        />

        <Column
          field="name"
          header="Name"
          filter
          filterPlaceholder="Search by name"
          style={{ minWidth: "12rem" }}
        />

        <Column
          header="Symbol"
          filterField="symbol"
          showFilterMatchModes={false}
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "14rem" }}
          body={symbolBodyTemplate}
          filter
          filterElement={symbolFilterTemplate}
        />

        <Column
          header="Date"
          filterField="date"
          dataType="date"
          style={{ minWidth: "10rem" }}
          body={dateBodyTemplate}
          filter
          filterElement={dateFilterTemplate}
        />

        <Column
          header="Unit Price"
          filterField="unit_price"
          dataType="numeric"
          style={{ minWidth: "10rem" }}
          body={unitPriceBodyTemplate}
          filter
          filterElement={balanceFilterTemplate}
        />

        <Column
          header="Amount"
          filterField="amount"
          dataType="numeric"
          style={{ minWidth: "10rem" }}
          body={amountBodyTemplate}
          filter
        />

        <Column
          header="Total Value"
          filterField="totalValue"
          dataType="numeric"
          style={{ minWidth: "10rem" }}
          body={totalValueBodyTemplate}
          filter
          filterElement={balanceFilterTemplate}
        />

        <Column
          field="action"
          header="Action"
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "12rem" }}
          body={actionBodyTemplate}
          filter
          filterElement={actionFilterTemplate}
        />

        <Column
          field="type"
          header="Type"
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "12rem" }}
          body={typeBodyTemplate}
          filter
          filterElement={typeFilterTemplate}
        />
      </DataTable>
    </React.Fragment>
  );
}
