import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Surface,
  Text,
  Card,
  useTheme,
  Button,
  IconButton,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../store/authStore';

const DashboardScreen = () => {
  const theme = useTheme();
  const { user, logout } = useAuthStore();

  const stats = [
    { label: 'Average GP', value: '65%', icon: 'trending-up', color: theme.colors.primary },
    { label: 'Food Cost', value: '28%', icon: 'food', color: theme.colors.secondary },
    { label: 'Total Items', value: '124', icon: 'format-list-bulleted', color: theme.colors.tertiary },
    { label: 'Active Recipes', value: '48', icon: 'chef-hat', color: theme.colors.primary },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
            {user?.businessName && (
              <Text style={[styles.businessName, { color: theme.colors.onSurfaceVariant }]}>
                {user.businessName}
              </Text>
            )}
          </View>
          <IconButton
            icon="logout"
            size={24}
            onPress={logout}
            style={styles.logoutButton}
          />
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Surface key={index} style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <IconButton
                icon={stat.icon}
                size={32}
                iconColor={stat.color}
                style={styles.statIcon}
              />
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                {stat.label}
              </Text>
            </Surface>
          ))}
        </View>

        <Card style={styles.quickActions}>
          <Card.Title
            title="Quick Actions"
            titleStyle={styles.sectionTitle}
          />
          <Card.Content>
            <Button
              mode="contained"
              icon="plus"
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Add New Ingredient
            </Button>
            <Button
              mode="outlined"
              icon="calculator"
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Calculate Recipe Cost
            </Button>
            <Button
              mode="outlined"
              icon="chart-line"
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              View Reports
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.recentActivity}>
          <Card.Title
            title="Recent Activity"
            titleStyle={styles.sectionTitle}
          />
          <Card.Content>
            <View style={styles.activityItem}>
              <IconButton icon="plus-circle" size={20} />
              <Text style={styles.activityText}>Added "Tomato Sauce" to ingredients</Text>
              <Text style={[styles.activityTime, { color: theme.colors.onSurfaceVariant }]}>
                2h ago
              </Text>
            </View>
            <Divider />
            <View style={styles.activityItem}>
              <IconButton icon="calculator" size={20} />
              <Text style={styles.activityText}>Calculated "Pasta Carbonara" cost</Text>
              <Text style={[styles.activityTime, { color: theme.colors.onSurfaceVariant }]}>
                5h ago
              </Text>
            </View>
            <Divider />
            <View style={styles.activityItem}>
              <IconButton icon="update" size={20} />
              <Text style={styles.activityText}>Updated "Olive Oil" price</Text>
              <Text style={[styles.activityTime, { color: theme.colors.onSurfaceVariant }]}>
                1d ago
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    opacity: 0.8,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  businessName: {
    fontSize: 14,
    marginTop: 4,
  },
  logoutButton: {
    margin: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  statIcon: {
    margin: 0,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  quickActions: {
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 8,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  recentActivity: {
    marginBottom: 24,
    borderRadius: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  activityTime: {
    fontSize: 12,
  },
});

export default DashboardScreen;
