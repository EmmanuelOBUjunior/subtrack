import { icons } from "@/constants/icons";
import { clsx } from "clsx";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

const CATEGORY_OPTIONS = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#ff6b6b",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#a8dadc",
  Design: "#f5c542",
  Productivity: "#c1e1ec",
  Cloud: "#e8d5f2",
  Music: "#ffc8dd",
  Other: "#f0f0f0",
};

interface CreateSubscriptionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateSubscription: (subscription: Subscription) => void;
}

const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({
  isVisible,
  onClose,
  onCreateSubscription,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    CATEGORY_OPTIONS[0],
  );
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
  }>({});

  // Validate form without side effects
  const validateForm = (
    nameValue: string,
    priceValue: string,
  ): { name?: string; price?: string } => {
    const newErrors: { name?: string; price?: string } = {};

    if (!nameValue.trim()) {
      newErrors.name = "Name is required";
    }

    const priceNum = Number.parseFloat(priceValue);
    if (!priceValue.trim()) {
      newErrors.price = "Price is required";
    } else if (Number.isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    return newErrors;
  };

  // Update errors when name or price changes
  useEffect(() => {
    setErrors(validateForm(name, price));
  }, [name, price]);

  const isFormValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const handleSubmit = () => {
    if (!isFormValid) {
      return;
    }

    const now = dayjs();
    const priceNum = Number.parseFloat(price);
    const startDate = now.toISOString();
    const renewalDate =
      frequency === "Yearly"
        ? now.add(1, "year").toISOString()
        : now.add(1, "month").toISOString();

    // Generate a unique ID
    const id = `subscription-${Date.now()}`;

    const newSubscription: Subscription = {
      id,
      name: name.trim(),
      price: priceNum,
      category: selectedCategory,
      currency: "USD",
      billing: frequency,
      status: "active",
      startDate,
      renewalDate,
      icon: icons.wallet,
      plan: selectedCategory,
      paymentMethod: "Not specified",
      color: CATEGORY_COLORS[selectedCategory],
    };

    onCreateSubscription(newSubscription);

    // Reset form
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setSelectedCategory(CATEGORY_OPTIONS[0]);
    setErrors({});

    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="modal-overlay">
          <Pressable className="flex-1" onPress={onClose} />

          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable
                className="modal-close"
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View className="modal-body">
                {/* Name Field */}
                <View className="auth-field">
                  <Text className="auth-label">Name</Text>
                  <TextInput
                    className={clsx(
                      "auth-input",
                      errors.name && "auth-input-error",
                    )}
                    placeholder="Subscription name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                  />
                  {!!errors.name && (
                    <Text className="auth-error">{errors.name}</Text>
                  )}
                </View>

                {/* Price Field */}
                <View className="auth-field">
                  <Text className="auth-label">Price (USD)</Text>
                  <TextInput
                    className={clsx(
                      "auth-input",
                      errors.price && "auth-input-error",
                    )}
                    placeholder="0.00"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    value={price}
                    onChangeText={setPrice}
                  />
                  {!!errors.price && (
                    <Text className="auth-error">{errors.price}</Text>
                  )}
                </View>

                {/* Frequency Picker */}
                <View className="auth-field">
                  <Text className="auth-label">Billing Frequency</Text>
                  <View className="picker-row">
                    {(["Monthly", "Yearly"] as const).map((freq) => (
                      <Pressable
                        key={freq}
                        className={clsx(
                          "picker-option",
                          frequency === freq && "picker-option-active",
                        )}
                        onPress={() => setFrequency(freq)}
                      >
                        <Text
                          className={clsx(
                            "picker-option-text",
                            frequency === freq && "picker-option-text-active",
                          )}
                        >
                          {freq}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Category Chips */}
                <View className="auth-field">
                  <Text className="auth-label">Category</Text>
                  <View className="category-scroll">
                    {CATEGORY_OPTIONS.map((category) => (
                      <Pressable
                        key={category}
                        className={clsx(
                          "category-chip",
                          selectedCategory === category &&
                            "category-chip-active",
                        )}
                        onPress={() => setSelectedCategory(category)}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            selectedCategory === category &&
                              "category-chip-text-active",
                          )}
                        >
                          {category}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Submit Button */}
                <Pressable
                  className={clsx(
                    "auth-button mt-6 mb-8",
                    !isFormValid && "auth-button-disabled",
                  )}
                  onPress={handleSubmit}
                  disabled={!isFormValid}
                >
                  <Text className="auth-button-text">Add Subscription</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;
