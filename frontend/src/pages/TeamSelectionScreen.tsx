//external imports
import React, { useCallback, useState } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';

//custom components
import {
    FullError,
    PrimaryButton,
    SearchBox,
    TeamsList,
} from '@components/index';

// constants
import { useNavigation } from '@react-navigation/native';
import { RosterNavigationProp } from '../types/Navigation';
import { useAuth } from '@hooks/useAuth';
import { useAllTeams } from '@hooks/index';
import { TeamIcon } from '../types/Team';

// const screenWidth = Dimensions.get('window').width - 20;
// const numColumns = 3;
// const tile = screenWidth / numColumns;

/** This component lets the user choose what teams they want to follow */
export const TeamSelectionScreen = () => {
    const { navigate } = useNavigation<RosterNavigationProp>();

    const { authData, updateTeams } = useAuth();
    const [selectedTeams, setSelectedTeams] = useState<string[]>(
        authData?.teams ?? []
    );

    const [submitting, setSubmitting] = useState<boolean>(false);

    const { data, isSuccess, isLoading, isError } = useAllTeams();

    const [result, setResult] = useState<TeamIcon[]>([]);

    // const renderItem = useCallback(
    //     ({ item }: { item: TeamIcon }) => {
    //         const handleSelectChange = (newStatus: boolean) => {
    //             if (newStatus) setSelectedTeams((prev) => [...prev, item.id]);
    //             else
    //                 setSelectedTeams((prev) =>
    //                     prev.filter((oldListItem) => oldListItem !== item.id)
    //                 );
    //         };

    //         return (
    //             <SelectCircle
    //                 initialState={selectedTeams.includes(item.id)}
    //                 url={item.icon}
    //                 size={tile}
    //                 onSelectChanged={handleSelectChange}
    //             />
    //         );
    //     },
    //     [selectedTeams]
    // );

    const submitTeamSelectionUpdates = async () => {
        setSubmitting(true);

        await updateTeams(selectedTeams);
        navigate('Dashboard');

        setSubmitting(false);
    };

    const handleSearchQueryChange = useCallback(
        (query: string) => {
            if (query === '') {
                setResult([]);
                return;
            }

            const _result = data!.filter((team) => {
                if (
                    team.abbr.toLowerCase().includes(query.toLowerCase()) ||
                    team.name.toLowerCase().includes(query.toLowerCase()) ||
                    team.short.toLowerCase().includes(query.toLowerCase())
                ) {
                    return true;
                }
                return false;
            });

            setResult(_result);
        },
        [data]
    );

    const addTeam = (id: string) => setSelectedTeams((prev) => prev.concat(id));
    const removeTeam = (id: string) =>
        setSelectedTeams((prev) => prev.filter((team) => team !== id));

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (isError) {
        return <FullError text="Cannot retrieve teams data. Try again later" />;
    }

    // if (isSuccess) {
    //     return (
    //         <FlatList
    //             data={data}
    //             renderItem={renderItem}
    //             numColumns={3}
    //             ItemSeparatorComponent={Seperator}
    //             ListHeaderComponent={
    //                 <PrimaryButton
    //                     text="Update Your Teams"
    //                     onPress={submitTeamSelectionUpdates}
    //                     loading={submitting}
    //                 />
    //             }
    //             ListFooterComponent={Seperator}
    //             contentContainerStyle={styles.container}
    //             ListHeaderComponentStyle={styles.headerContainer}
    //         />
    //     );
    // }

    return (
        <View style={styles.container}>
            {isSuccess && (
                <>
                    <PrimaryButton
                        onPress={submitTeamSelectionUpdates}
                        text="Update Stats"
                        loading={submitting}
                    />
                    <SearchBox
                        placeholder="Search for stats"
                        onChange={handleSearchQueryChange}
                    />
                    <TeamsList
                        teams={result}
                        selected={selectedTeams}
                        addTeam={addTeam}
                        removeTeam={removeTeam}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontWeight: 'bold',
        fontSize: 22,
        marginBottom: 20,
    },
    container: {
        alignItems: 'center',
    },
    headerContainer: {
        width: '100%',
    },
});
