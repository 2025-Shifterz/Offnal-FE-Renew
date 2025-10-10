import AsyncStorage from '@react-native-async-storage/async-storage'

// persist 미들웨어는 AsyncStorage를 직접 사용할 수 없음 -> 타입 정의
export const AsyncStorageAdapter = {
  getItem: async (name: string) => {
    const value = await AsyncStorage.getItem(name)
    return value ? JSON.parse(value) : null
  },
  setItem: async (name: string, value: any) => {
    await AsyncStorage.setItem(name, JSON.stringify(value))
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name)
  },
}
