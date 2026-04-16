import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import dayjs from "dayjs";
import { styled } from "nativewind";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, G, Line } from "react-native-svg";

const SafeAreaView = styled(RNSafeAreaView);

interface CategorySpending {
  category: string;
  amount: number;
  count: number;
}

interface MonthlySpending {
  month: string;
  amount: number;
}

const Insights = () => {
  // Calculate spending by category
  const spendingByCategory = useMemo(() => {
    const categoryMap = new Map<string, CategorySpending>();

    HOME_SUBSCRIPTIONS.forEach((sub) => {
      const category = sub.category || "Other";
      const monthlyAmount =
        sub.billing === "Yearly" ? sub.price / 12 : sub.price;

      if (categoryMap.has(category)) {
        const existing = categoryMap.get(category);
        if (existing) {
          categoryMap.set(category, {
            category,
            amount: existing.amount + monthlyAmount,
            count: existing.count + 1,
          });
        }
      } else {
        categoryMap.set(category, {
          category,
          amount: monthlyAmount,
          count: 1,
        });
      }
    });

    return Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount);
  }, []);

  // Calculate monthly spending for the last 12 months
  const monthlySpending = useMemo(() => {
    // Calculate a single projected monthly total since subscriptions are recurring with no end date
    const projectedMonthlyTotal = HOME_SUBSCRIPTIONS.reduce((sum, sub) => {
      const monthlyAmount =
        sub.billing === "Yearly" ? sub.price / 12 : sub.price;
      return sum + monthlyAmount;
    }, 0);

    // Generate months with the same projected total
    const months: MonthlySpending[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = dayjs().subtract(i, "month");
      const month = date.format("MMM");

      months.push({
        month,
        amount: projectedMonthlyTotal,
      });
    }
    return months;
  }, []);

  // Calculate history events
  const historyEvents = useMemo(() => {
    const events: Array<{
      id: string;
      type: "created" | "renewed";
      name: string;
      date: string;
      amount: number;
    }> = [];

    HOME_SUBSCRIPTIONS.forEach((sub) => {
      if (sub.renewalDate) {
        events.push({
          id: `${sub.id}-renew`,
          type: "renewed",
          name: sub.name,
          date: sub.renewalDate,
          amount: sub.price,
        });
      }
      if (sub.startDate) {
        events.push({
          id: `${sub.id}-start`,
          type: "created",
          name: sub.name,
          date: sub.startDate,
          amount: sub.price,
        });
      }
    });

    return events.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, []);

  const totalMonthlySpending = useMemo(() => {
    return spendingByCategory.reduce((sum, cat) => sum + cat.amount, 0);
  }, [spendingByCategory]);

  const maxCategoryAmount = useMemo(() => {
    return Math.max(...spendingByCategory.map((c) => c.amount), 0);
  }, [spendingByCategory]);

  const maxMonthlyAmount = useMemo(() => {
    return Math.max(...monthlySpending.map((m) => m.amount), 0);
  }, [monthlySpending]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-5 pb-20">
          {/* Header */}
          <Text className="text-2xl font-sans-bold text-primary mb-5">
            Insights
          </Text>

          {/* Total Spending Card */}
          <View className="home-balance-card mb-5">
            <Text className="home-balance-label">Monthly Spending</Text>
            <Text className="home-balance-amount">
              ${totalMonthlySpending.toFixed(2)}
            </Text>
            <Text className="home-balance-label mt-3 text-sm">
              {HOME_SUBSCRIPTIONS.length} subscriptions
            </Text>
          </View>

          {/* Monthly Trend Chart */}
          <View className="mb-6">
            <Text className="text-lg font-sans-bold text-primary mb-4">
              Spending Trend (12 Months)
            </Text>
            <View className="bg-card rounded-2xl p-4 border border-border">
              <Svg height="200" width="100%">
                {/* Grid lines and axes */}
                <Line
                  x1="40"
                  y1="20"
                  x2="40"
                  y2="160"
                  stroke="#e0e0e0"
                  strokeWidth="1"
                />
                <Line
                  x1="40"
                  y1="160"
                  x2="350"
                  y2="160"
                  stroke="#e0e0e0"
                  strokeWidth="1"
                />

                {/* Data points and lines */}
                {Array.from(monthlySpending.entries()).map(([index, data]) => {
                  const x =
                    40 + (index / (monthlySpending.length - 1 || 1)) * 310;
                  const y = 160 - (data.amount / (maxMonthlyAmount || 1)) * 130;

                  return (
                    <G key={`month-${data.month}-${index}`}>
                      {index > 0 && (
                        <Line
                          x1={
                            40 +
                            ((index - 1) / (monthlySpending.length - 1)) * 310
                          }
                          y1={
                            160 -
                            ((monthlySpending.at(index - 1)?.amount ?? 0) /
                              (maxMonthlyAmount || 1)) *
                              130
                          }
                          x2={x}
                          y2={y}
                          stroke="#ea7a53"
                          strokeWidth="2"
                        />
                      )}
                      <Circle cx={x} cy={y} r="4" fill="#ea7a53" />
                    </G>
                  );
                })}
              </Svg>
              <View className="flex-row justify-between mt-2 px-2">
                <Text className="text-xs font-sans-medium text-muted-foreground">
                  {monthlySpending.at(0)?.month}
                </Text>
                <Text className="text-xs font-sans-medium text-muted-foreground">
                  {monthlySpending.at(-1)?.month}
                </Text>
              </View>
            </View>
          </View>

          {/* Spending by Category */}
          <View className="mb-6">
            <Text className="text-lg font-sans-bold text-primary mb-4">
              Spending by Category
            </Text>
            {spendingByCategory.map((category) => {
              const percentage =
                maxCategoryAmount > 0
                  ? (category.amount / maxCategoryAmount) * 100
                  : 0;
              return (
                <View key={category.category} className="mb-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1">
                      <Text className="font-sans-semibold text-primary">
                        {category.category}
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        {category.count} subscription
                        {category.count === 1 ? "" : "s"}
                      </Text>
                    </View>
                    <Text className="font-sans-bold text-primary ml-2">
                      ${category.amount.toFixed(2)}/mo
                    </Text>
                  </View>
                  <View className="bg-muted rounded-full h-2 overflow-hidden">
                    <View
                      className="bg-accent h-full rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          {/* History Section */}
          <View className="mb-6">
            <Text className="text-lg font-sans-bold text-primary mb-4">
              Recent Activity
            </Text>
            {historyEvents.length === 0 ? (
              <Text className="text-center text-muted-foreground">
                No activity yet
              </Text>
            ) : (
              historyEvents.slice(0, 10).map((item) => (
                <View
                  key={item.id}
                  className="bg-card rounded-2xl p-4 mb-3 border border-border flex-row items-center justify-between"
                >
                  <View className="flex-1">
                    <Text className="font-sans-semibold text-primary mb-1">
                      {item.name}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {item.type === "created" && "Subscription started"}
                      {item.type === "renewed" && "Subscription renewing"}
                      {" • "}
                      {dayjs(item.date).format("MMM DD, YYYY")}
                    </Text>
                  </View>
                  <Text className="font-sans-bold text-primary ml-3">
                    ${item.amount.toFixed(2)}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;
